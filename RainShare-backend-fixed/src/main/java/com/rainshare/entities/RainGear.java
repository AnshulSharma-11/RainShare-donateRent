package com.rainshare.entities;

import com.rainshare.enums.GearCondition;
import com.rainshare.enums.GearStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rain_gears")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RainGear {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    private String imageUrl;

    @Column(name = "`condition`")
    @Enumerated(EnumType.STRING)
    private GearCondition condition;

    private Double rentPrice;

    @Enumerated(EnumType.STRING)
    private GearStatus status;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    private LocalDateTime createdAt;
}
