package com.snap_service.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.snap_service.Entity.ServiceSubcategory;
import com.snap_service.Service.ServiceSubcategoryService;

@RestController
@RequestMapping("/api/subcategories")
public class ServiceSubcategoryController {

    @Autowired
    private ServiceSubcategoryService subcategoryService;

    @PostMapping("/{serviceId}")
    public ResponseEntity<ServiceSubcategory> addSubcategory(
            @RequestBody ServiceSubcategory subcategory,
            @PathVariable Integer serviceId) {

        return ResponseEntity.ok(
                subcategoryService.addSubcategory(subcategory, serviceId)
        );
    }

    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<ServiceSubcategory>> getByService(
            @PathVariable Integer serviceId) {

        return ResponseEntity.ok(
                subcategoryService.getByService(serviceId)
        );
    }
}
