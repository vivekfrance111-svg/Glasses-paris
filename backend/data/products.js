const products = [
    {
        name: 'Aries Rectangular Glasses',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop',
        brand: 'Lumina',
        description: 'Premium rectangular frames with a modern touch. Lightweight titanium alloy construction with adjustable nose pads for all-day comfort.',
        price: 129.99,
        countInStock: 15,
        rating: 4.5,
        numReviews: 12,
        frameStyle: 'Rectangular',
        color: 'Black',
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
        description: 'Classic round sunglasses with UV400 protection. Hand-polished acetate frames with spring hinges for a perfect fit.',
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
        description: 'Iconic aviator frames made from high-grade titanium. Ultra-lightweight at just 18g with anti-slip silicone temple tips.',
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
    },
    {
        name: 'Nova Wayfarer Elite',
        image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=800&auto=format&fit=crop',
        brand: 'Lumina',
        description: 'A modern take on the iconic wayfarer silhouette. Bio-acetate frames with keyhole bridge and premium CR-39 lenses.',
        price: 159.99,
        countInStock: 18,
        rating: 4.7,
        numReviews: 15,
        frameStyle: 'Wayfarer',
        color: 'Black',
        dimensions: '54-18-145',
        lensOptions: [
            { lensType: 'Standard Tint', additionalPrice: 0 },
            { lensType: 'Polarized', additionalPrice: 30 },
            { lensType: 'Gradient', additionalPrice: 25 }
        ]
    },
    {
        name: 'Aurora Cat Eye',
        image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=800&auto=format&fit=crop',
        brand: 'Lumina',
        description: 'Elegant cat eye frames that blend vintage glamour with modern sophistication. Lightweight with embedded flex hinges.',
        price: 149.99,
        countInStock: 12,
        rating: 4.6,
        numReviews: 9,
        frameStyle: 'Cat Eye',
        color: 'Gold',
        dimensions: '53-16-140',
        lensOptions: [
            { lensType: 'Single Vision', additionalPrice: 0 },
            { lensType: 'Blue Light', additionalPrice: 20 },
            { lensType: 'Progressive', additionalPrice: 50 }
        ]
    },
    {
        name: 'Zenith Clubmaster',
        image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?q=80&w=800&auto=format&fit=crop',
        brand: 'Lumina',
        description: 'Retro-inspired browline frames with a contemporary twist. Premium acetate brow bar with brushed metal lower rims.',
        price: 179.99,
        countInStock: 8,
        rating: 4.4,
        numReviews: 11,
        frameStyle: 'Rectangular',
        color: 'Tortoise',
        dimensions: '51-21-145',
        lensOptions: [
            { lensType: 'Single Vision', additionalPrice: 0 },
            { lensType: 'Polarized', additionalPrice: 30 },
            { lensType: 'Transition', additionalPrice: 60 }
        ]
    },
    {
        name: 'Eclipse Shield Sunglasses',
        image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=800&auto=format&fit=crop',
        brand: 'Lumina',
        description: 'Bold wraparound shield lens design for maximum sun protection. Sporty yet refined TR-90 nylon frame with rubber grips.',
        price: 219.99,
        countInStock: 6,
        rating: 4.3,
        numReviews: 7,
        frameStyle: 'Aviator',
        color: 'Black',
        dimensions: '65-12-125',
        lensOptions: [
            { lensType: 'Standard Tint', additionalPrice: 0 },
            { lensType: 'Polarized', additionalPrice: 30 },
            { lensType: 'Mirror', additionalPrice: 35 }
        ]
    },
    {
        name: 'Prism Blue Light Glasses',
        image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=800&auto=format&fit=crop',
        brand: 'Lumina',
        description: 'Engineered for the digital age. Ultra-thin stainless steel frames with premium blue-light filtering lenses to reduce eye strain.',
        price: 109.99,
        countInStock: 25,
        rating: 4.7,
        numReviews: 22,
        frameStyle: 'Round',
        color: 'Silver',
        dimensions: '49-19-140',
        lensOptions: [
            { lensType: 'Blue Light', additionalPrice: 0 },
            { lensType: 'Blue Light + Progressive', additionalPrice: 50 }
        ]
    }
];

export default products;
