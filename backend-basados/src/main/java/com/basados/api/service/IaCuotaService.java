package com.basados.api.service;

import com.basados.api.entity.IaUsoInvitado;
import com.basados.api.entity.Usuario;
import com.basados.api.repository.IaUsoInvitadoRepository;
import com.basados.api.repository.UsuarioRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Optional;
import java.util.UUID;

@Service
public class IaCuotaService {

    private static final int LIMITE_TOKENS_INVITADO = 20000;
    private static final int LIMITE_TOKENS_USUARIO = 40000;
    private static final ZoneId ZONA_RESET = ZoneId.of("America/Santiago");

    private final UsuarioRepository usuarioRepository;
    private final IaUsoInvitadoRepository iaUsoInvitadoRepository;

    public IaCuotaService(UsuarioRepository usuarioRepository, IaUsoInvitadoRepository iaUsoInvitadoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.iaUsoInvitadoRepository = iaUsoInvitadoRepository;
    }

    @Transactional
    public boolean verificarYReservarCuota(String ip, int tokensEstimados) {
        Optional<UUID> userId = obtenerUsuarioAutenticado();

        if (userId.isPresent()) {
            Usuario usuario = usuarioRepository.findById(userId.get()).orElse(null);
            if (usuario == null) {
                return false;
            }
            reiniciarSiCorrespondeUsuario(usuario);
            if (usuario.getIaTokensConsumidos() + tokensEstimados > LIMITE_TOKENS_USUARIO) {
                usuarioRepository.save(usuario);
                return false;
            }
            usuario.setIaTokensConsumidos(usuario.getIaTokensConsumidos() + tokensEstimados);
            usuarioRepository.save(usuario);
            return true;
        }

        String ipLimitada = ip != null && ip.length() > 45 ? ip.substring(0, 45) : ip;
        IaUsoInvitado uso = obtenerOCrearUsoInvitado(ipLimitada);
        reiniciarSiCorrespondeInvitado(uso);
        if (uso.getTokensConsumidos() + tokensEstimados > LIMITE_TOKENS_INVITADO) {
            iaUsoInvitadoRepository.save(uso);
            return false;
        }
        uso.setTokensConsumidos(uso.getTokensConsumidos() + tokensEstimados);
        iaUsoInvitadoRepository.save(uso);
        return true;
    }

    @Transactional
    public void ajustarConsumoReal(String ip, int tokensEstimados, int tokensReales) {
        int diferencia = tokensReales - tokensEstimados;
        if (diferencia == 0) return;

        Optional<UUID> userId = obtenerUsuarioAutenticado();

        if (userId.isPresent()) {
            usuarioRepository.findById(userId.get()).ifPresent(usuario -> {
                int nuevoTotal = Math.max(0, usuario.getIaTokensConsumidos() + diferencia);
                usuario.setIaTokensConsumidos(nuevoTotal);
                usuarioRepository.save(usuario);
            });
            return;
        }

        String ipLimitada = ip != null && ip.length() > 45 ? ip.substring(0, 45) : ip;
        iaUsoInvitadoRepository.findById(ipLimitada).ifPresent(uso -> {
            int nuevoTotal = Math.max(0, uso.getTokensConsumidos() + diferencia);
            uso.setTokensConsumidos(nuevoTotal);
            iaUsoInvitadoRepository.save(uso);
        });
    }

    private IaUsoInvitado obtenerOCrearUsoInvitado(String ip) {
        return iaUsoInvitadoRepository.findById(ip)
            .orElseGet(() -> new IaUsoInvitado(ip, LocalDate.now(ZONA_RESET), 0));
    }

    private void reiniciarSiCorrespondeUsuario(Usuario usuario) {
        LocalDate hoy = LocalDate.now(ZONA_RESET);
        if (usuario.getIaTokensConsumidos() == null
                || usuario.getIaFechaReset() == null
                || !usuario.getIaFechaReset().isEqual(hoy)) {
            usuario.setIaTokensConsumidos(0);
            usuario.setIaFechaReset(hoy);
        }
    }

    private void reiniciarSiCorrespondeInvitado(IaUsoInvitado uso) {
        LocalDate hoy = LocalDate.now(ZONA_RESET);
        if (uso.getTokensConsumidos() == null
                || uso.getFecha() == null
                || !uso.getFecha().isEqual(hoy)) {
            uso.setTokensConsumidos(0);
            uso.setFecha(hoy);
        }
    }

    private Optional<UUID> obtenerUsuarioAutenticado() {
        Object principal = SecurityContextHolder.getContext().getAuthentication() != null
            ? SecurityContextHolder.getContext().getAuthentication().getPrincipal()
            : null;

        if (principal == null || "anonymousUser".equals(principal)) {
            return Optional.empty();
        }

        try {
            return Optional.of(UUID.fromString(principal.toString()));
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }
}