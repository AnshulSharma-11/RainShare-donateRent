package com.rainshare.entities;

import com.rainshare.enums.DonationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate donationDate;

    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private DonationStatus status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User donor;

    @ManyToOne
    @JoinColumn(name = "gear_id")
    private RainGear rainGear;
}
