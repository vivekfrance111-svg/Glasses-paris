const products = [
    {
        name: 'Aries Rectangular Glasses',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop',
        brand: 'Lumina',
        description: 'Premium rectangular frames with a modern touch. Lightweight and durable.',
        price: 129.99,
        countInStock: 15,
        rating: 4.5,
        numReviews: 12,
        frameStyle: 'Rectangular',
        color: 'Black/Gold',
        dimensions: '52-18-140',
        lensOptions: [
            { lensType: 'Single Vision', additionalPrice: 0 },
            { lensType: 'Progressive', additionalPrice: 50 },
            { lensType: 'Blue Light', additionalPrice: 20 }
        ]
    },
    {
        name: 'Luna Round Sunglasses',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop',
        brand: 'Lumina',
        description: 'Classic round sunglasses with UV400 protection. Perfect for a sunny day.',
        price: 89.99,
        countInStock: 20,
        rating: 4.8,
        numReviews: 8,
        frameStyle: 'Round',
        color: 'Tortoise',
        dimensions: '50-20-145',
        lensOptions: [
            { lensType: 'Standard Tint', additionalPrice: 0 },
            { lensType: 'Polarized', additionalPrice: 30 }
        ]
    },
    {
        name: 'Titan Aviator',
        image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=800&auto=format&fit=crop',
        brand: 'Lumina',
        description: 'Iconic aviator frames made from high-grade titanium. Ultra-lightweight.',
        price: 199.99,
        countInStock: 10,
        rating: 4.9,
        numReviews: 5,
        frameStyle: 'Aviator',
        color: 'Silver',
        dimensions: '58-14-140',
        lensOptions: [
            { lensType: 'Single Vision', additionalPrice: 0 },
            { lensType: 'Transition', additionalPrice: 60 }
        ]
    }
];

export default products;
