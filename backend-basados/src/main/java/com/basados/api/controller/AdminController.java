package com.basados.api.controller;

import com.basados.api.dto.AdminMetricasDTO;
import com.basados.api.dto.MaestroParrilleroDTO;
import com.basados.api.service.AdminService;
import com.basados.api.service.MaestroParrilleroService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final MaestroParrilleroService maestroParrilleroService;

    public AdminController(AdminService adminService,
                           MaestroParrilleroService maestroParrilleroService) {
        this.adminService = adminService;
        this.maestroParrilleroService = maestroParrilleroService;
    }

    @GetMapping("/metricas")
    public AdminMetricasDTO obtenerMetricas() {
        return adminService.obtenerMetricas();
    }

    @GetMapping("/auditoria-productos")
    public ResponseEntity<?> obtenerFeedAuditoria() {
        return ResponseEntity.ok(adminService.obtenerFeedAuditoriaProductos());
    }

    @GetMapping("/maestros-pendientes")
    public ResponseEntity<List<MaestroParrilleroDTO>> maestrosPendientes() {
        return ResponseEntity.ok(maestroParrilleroService.listarPendientes());
    }

    @PutMapping("/maestros-pendientes/{id}/aprobar")
    public ResponseEntity<String> aprobarMaestro(@PathVariable Long id) {
        maestroParrilleroService.aprobar(id);
        return ResponseEntity.ok("Maestro aprobado correctamente");
    }

    @DeleteMapping("/maestros-pendientes/{id}/rechazar")
    public ResponseEntity<String> rechazarMaestro(@PathVariable Long id) {
        maestroParrilleroService.rechazar(id);
        return ResponseEntity.ok("Solicitud rechazada");
    }
}