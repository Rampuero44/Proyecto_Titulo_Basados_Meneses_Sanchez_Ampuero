package com.basados.api.controller;

import com.basados.api.dto.ActualizarNombreDTO;
import com.basados.api.dto.UsuarioPerfilDTO;
import com.basados.api.entity.Usuario;
import com.basados.api.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/me")
    public UsuarioPerfilDTO obtenerPerfil() {
        UUID userId = obtenerUsuarioId();
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        return toDTO(usuario);
    }

    @PutMapping("/me/nombre")
    public UsuarioPerfilDTO actualizarNombre(@Valid @RequestBody ActualizarNombreDTO dto) {
        UUID userId = obtenerUsuarioId();
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        usuario.setNombre(dto.getNombre().trim());
        usuarioRepository.save(usuario);
        return toDTO(usuario);
    }

    private UUID obtenerUsuarioId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No autenticado");
        }
        return UUID.fromString(auth.getPrincipal().toString());
    }

    private UsuarioPerfilDTO toDTO(Usuario usuario) {
        UsuarioPerfilDTO dto = new UsuarioPerfilDTO();
        dto.setIdUsuario(usuario.getIdUsuario());
        dto.setNombre(usuario.getNombre());
        dto.setApellido(usuario.getApellido());
        dto.setCorreo(usuario.getCorreo());
        dto.setRol(usuario.getRol());
        dto.setTelefono(usuario.getTelefono());
        return dto;
    }
}