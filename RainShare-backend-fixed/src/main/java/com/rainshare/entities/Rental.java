package com.rainshare.entities;

import com.rainshare.enums.RentalStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "rentals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rental {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate rentDate;

    private LocalDate returnDate;

    private LocalDateTime createdAt;

    private LocalDateTime approvedAt;

    private LocalDateTime declinedAt;

    private LocalDateTime returnedAt;

    private LocalDateTime cancelledAt;

    private LocalDateTime flaggedAt;

    @Enumerated(EnumType.STRING)
    private RentalStatus status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User renter;

    @ManyToOne
    @JoinColumn(name = "gear_id")
    private RainGear rainGear;

}
