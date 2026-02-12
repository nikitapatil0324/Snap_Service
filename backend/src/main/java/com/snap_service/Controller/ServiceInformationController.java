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

import com.snap_service.Entity.ServiceInformation;
import com.snap_service.Service.ServiceInformationService;

@RestController
@RequestMapping("/api/service-info")
public class ServiceInformationController {

    @Autowired
    private ServiceInformationService infoService;

    @PostMapping("/{serviceId}/{subcategoryId}")
    public ResponseEntity<ServiceInformation> addInfo(
            @RequestBody ServiceInformation info,
            @PathVariable Integer serviceId,
            @PathVariable Integer subcategoryId) {

        return ResponseEntity.ok(
                infoService.addInfo(info, serviceId, subcategoryId)
        );
    }

    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<ServiceInformation>> getByService(
            @PathVariable Integer serviceId) {

        return ResponseEntity.ok(
                infoService.getByService(serviceId)
        );
    }
}
