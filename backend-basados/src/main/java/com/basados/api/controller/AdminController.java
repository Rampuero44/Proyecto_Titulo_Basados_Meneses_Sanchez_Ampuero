package com.basados.api.controller;

import com.basados.api.dto.AdminMetricasDTO;
import com.basados.api.service.AdminService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/metricas")
    public AdminMetricasDTO obtenerMetricas() {
        return adminService.obtenerMetricas();
    }
}