<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3002');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Get the user_id from query parameters
$user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;
$role = isset($_GET['role']) ? $_GET['role'] : 'driver'; // default to driver

if (!$user_id) {
    echo json_encode([
        'success' => false,
        'message' => 'User ID is required'
    ]);
    exit;
}

// Mock review data based on user_id
$mockReviews = [
    1 => [ // Driver reviews
        [
            'review_id' => 1,
            'rating' => 5,
            'user_name' => 'Sarah Johnson',
            'date' => '2025-09-20',
            'text' => 'Excellent driver! Very professional and punctual. Made our airport transfer smooth and comfortable.'
        ],
        [
            'review_id' => 2,
            'rating' => 5,
            'user_name' => 'Michael Chen',
            'date' => '2025-09-18',
            'text' => 'Amazing driver. Safe, reliable, and knows all the best routes.'
        ],
        [
            'review_id' => 3,
            'rating' => 4,
            'user_name' => 'Emma Wilson',
            'date' => '2025-09-15',
            'text' => 'Good service and clean vehicle. Would recommend for city tours.'
        ]
    ],
    2 => [ // Driver reviews
        [
            'review_id' => 4,
            'rating' => 4,
            'user_name' => 'David Kumar',
            'date' => '2025-09-22',
            'text' => 'Professional service with luxury vehicle. Perfect for business meetings.'
        ],
        [
            'review_id' => 5,
            'rating' => 5,
            'user_name' => 'Lisa Zhang',
            'date' => '2025-09-19',
            'text' => 'Excellent VIP service. Comfortable ride and great knowledge of the area.'
        ],
        [
            'review_id' => 6,
            'rating' => 4,
            'user_name' => 'Robert Mills',
            'date' => '2025-09-16',
            'text' => 'Good long distance driver. Made our trip very pleasant.'
        ]
    ],
    3 => [ // Guide reviews
        [
            'review_id' => 7,
            'rating' => 5,
            'user_name' => 'Jessica Adams',
            'date' => '2025-09-21',
            'text' => 'Exceptional guide! Knowledge of heritage and temples is incredible.'
        ],
        [
            'review_id' => 8,
            'rating' => 5,
            'user_name' => 'Thomas Mueller',
            'date' => '2025-09-17',
            'text' => 'Amazing cultural tour guide. Made our visits very educational.'
        ],
        [
            'review_id' => 9,
            'rating' => 4,
            'user_name' => 'Sophie Brown',
            'date' => '2025-09-14',
            'text' => 'Great recommendations and photography spots. Highly recommended!'
        ]
    ],
    4 => [ // Guide reviews
        [
            'review_id' => 10,
            'rating' => 4,
            'user_name' => 'Rachel Green',
            'date' => '2025-09-22',
            'text' => 'Amazing wildlife guide! Spotted so many animals we would have missed.'
        ],
        [
            'review_id' => 11,
            'rating' => 5,
            'user_name' => 'Kevin Park',
            'date' => '2025-09-18',
            'text' => 'Best nature trail guide ever! Knowledge of parks is incredible.'
        ],
        [
            'review_id' => 12,
            'rating' => 4,
            'user_name' => 'Laura Davis',
            'date' => '2025-09-15',
            'text' => 'Great adventure tour experience. Made our walks educational.'
        ]
    ]
];

// Get reviews for the specified user
$reviews = isset($mockReviews[$user_id]) ? $mockReviews[$user_id] : [];

// Calculate average rating and total reviews
$totalRating = 0;
$totalReviews = count($reviews);

foreach ($reviews as $review) {
    $totalRating += $review['rating'];
}

$averageRating = $totalReviews > 0 ? round($totalRating / $totalReviews, 1) : 0;

echo json_encode([
    'success' => true,
    'reviews' => $reviews,
    'average_rating' => $averageRating,
    'total_reviews' => $totalReviews
]);
