package com.snap_service.dto;

public class ProviderRatingDTO {
    private Double averageRating;
    private Long reviewCount;

    public ProviderRatingDTO(Double averageRating, Long reviewCount) {
        this.averageRating = averageRating;
        this.reviewCount = reviewCount;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Long getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Long reviewCount) {
        this.reviewCount = reviewCount;
    }
}
