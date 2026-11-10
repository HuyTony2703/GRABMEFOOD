export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  distance: string;
  price: string;
  cuisine: string;
  image: string;
  onSale?: boolean;
  discount?: string;
  dishes?: Dish[];
}

export interface Dish {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  price: string;
  cuisine: string;
  image: string;
  isDish?: boolean;
  restaurantIds?: string[];
}

export const nearbyRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Phở Hà Nội",
    rating: 4.8,
    reviews: 245,
    distance: "0.3 km",
    price: "50-80k",
    cuisine: "Noodles",
    image: "https://images.unsplash.com/photo-1697652974652-fe755a11cc93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwcGhvJTIwbm9vZGxlcyUyMGJvd2x8ZW58MXx8fHwxNzc2MzEzMzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "2",
    name: "Highlands Coffee",
    rating: 4.6,
    reviews: 892,
    distance: "0.5 km",
    price: "30-100k",
    cuisine: "Cafe",
    image: "https://images.unsplash.com/photo-1642647916129-3909c75c0267?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwY2FmZSUyMGludGVyaW9yfGVufDF8fHx8MTc3NjMxMzM0OHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "3",
    name: "Gogi House",
    rating: 4.7,
    reviews: 567,
    distance: "1.2 km",
    price: "200-400k",
    cuisine: "Hotpot",
    image: "https://images.unsplash.com/photo-1708388065058-c12722616143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiYnElMjBob3Rwb3QlMjByZXN0YXVyYW50fGVufDF8fHx8MTc3NjMxMzM0OHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "4",
    name: "Bánh Mì 37",
    rating: 4.9,
    reviews: 1234,
    distance: "0.8 km",
    price: "20-35k",
    cuisine: "Snacks",
    image: "https://images.unsplash.com/photo-1599719455360-ff0be7c4dd06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5oJTIwbWklMjB2aWV0bmFtZXNlJTIwc2FuZHdpY2h8ZW58MXx8fHwxNzc2MzEzMzQ5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "5",
    name: "Hủ Tiếu Bé Bơ",
    rating: 4.8,
    reviews: 456,
    distance: "0.7 km",
    price: "35-60k",
    cuisine: "Noodles",
    image: "https://images.unsplash.com/photo-1731460202531-bf8389d565f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwaHUlMjB0aWV1JTIwbm9vZGxlJTIwc291cHxlbnwxfHx8fDE3NzYzOTg2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    dishes: [
      {
        id: "d1",
        name: "Hủ Tiếu Nam Vang",
        rating: 4.8,
        reviews: 234,
        price: "45k",
        cuisine: "Noodles",
        image: "https://images.unsplash.com/photo-1731460202531-bf8389d565f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwaHUlMjB0aWV1JTIwbm9vZGxlJTIwc291cHxlbnwxfHx8fDE3NzYzOTg2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      },
      {
        id: "d2",
        name: "Bún Riêu Cua",
        rating: 4.7,
        reviews: 189,
        price: "40k",
        cuisine: "Noodles",
        image: "https://images.unsplash.com/photo-1745817078506-bfc70df458b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnVuJTIwcmlldSUyMGNyYWIlMjBub29kbGUlMjBzb3VwfGVufDF8fHx8MTc3NjM5ODYzNHww&ixlib=rb-4.1.0&q=80&w=1080",
      },
      {
        id: "d3",
        name: "Bún Mọc",
        rating: 4.6,
        reviews: 156,
        price: "38k",
        cuisine: "Noodles",
        image: "https://images.unsplash.com/photo-1583316175701-0bc5f25a0a44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnVuJTIwbW9jJTIwcG9yayUyMGJhbGwlMjBub29kbGV8ZW58MXx8fHwxNzc2Mzk4NjM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      },
      {
        id: "d4",
        name: "Bún Chả",
        rating: 4.9,
        reviews: 312,
        price: "50k",
        cuisine: "Noodles",
        image: "https://images.unsplash.com/photo-1763703544688-2ac7839b0659?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnVuJTIwY2hhJTIwbm9vZGxlc3xlbnwxfHx8fDE3NzYzMTMzNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      },
      {
        id: "d5",
        name: "Bánh Canh Cua",
        rating: 4.5,
        reviews: 178,
        price: "42k",
        cuisine: "Noodles",
        image: "https://images.unsplash.com/photo-1558722199-56eabc94fb69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYmFuaCUyMGNhbmglMjB0aGljayUyMG5vb2RsZSUyMHNvdXB8ZW58MXx8fHwxNzc2Mzk4NjM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      },
    ],
  },
  {
    id: "14",
    name: "Cơm Gà Nguyên Ký Prime",
    rating: 4.9,
    reviews: 678,
    distance: "0.4 km",
    price: "30-60k",
    cuisine: "Vietnamese",
    image: "https://images.unsplash.com/photo-1677354469663-dc918927fd93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwY2hpY2tlbiUyMHJpY2UlMjBjb20lMjBnYXxlbnwxfHx8fDE3NzYzOTg2MzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    dishes: [
      {
        id: "d6",
        name: "Cơm Gà Xối Mỡ",
        rating: 4.9,
        reviews: 456,
        price: "30k",
        cuisine: "Vietnamese",
        image: "https://images.unsplash.com/photo-1677354469663-dc918927fd93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwY2hpY2tlbiUyMHJpY2UlMjBjb20lMjBnYXxlbnwxfHx8fDE3NzYzOTg2MzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      },
      {
        id: "d7",
        name: "Cơm Gà Luộc",
        rating: 4.8,
        reviews: 389,
        price: "35k",
        cuisine: "Vietnamese",
        image: "https://images.unsplash.com/photo-1677354469663-dc918927fd93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwY2hpY2tlbiUyMHJpY2UlMjBjb20lMjBnYXxlbnwxfHx8fDE3NzYzOTg2MzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      },
      {
        id: "d8",
        name: "Cơm Gà Rô Ti",
        rating: 4.7,
        reviews: 298,
        price: "40k",
        cuisine: "Vietnamese",
        image: "https://images.unsplash.com/photo-1677354469663-dc918927fd93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwY2hpY2tlbiUyMHJpY2UlMjBjb20lMjBnYXxlbnwxfHx8fDE3NzYzOTg2MzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      },
    ],
  },
];

export const saleRestaurants: Restaurant[] = [
  {
    id: "6",
    name: "KFC Discount",
    rating: 4.4,
    reviews: 678,
    distance: "2.1 km",
    price: "60-150k",
    cuisine: "Fast Food",
    image: "https://images.unsplash.com/photo-1766589221324-656419e4c844?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMGNoaWNrZW4lMjBtZWFsJTIwZmFzdCUyMGZvb2R8ZW58MXx8fHwxNzc2MzEzMzUwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    onSale: true,
    discount: "30% OFF",
  },
  {
    id: "7",
    name: "Pizza 4P's",
    rating: 4.8,
    reviews: 1567,
    distance: "1.8 km",
    price: "150-350k",
    cuisine: "Italian",
    image: "https://images.unsplash.com/photo-1680405620826-83b0f0f61b28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMG1hcmdoZXJpdGElMjBpdGFsaWFufGVufDF8fHx8MTc3NjMwMDIzOXww&ixlib=rb-4.1.0&q=80&w=1080",
    onSale: true,
    discount: "20% OFF",
  },
  {
    id: "8",
    name: "Trà Sữa Bobapop",
    rating: 4.6,
    reviews: 445,
    distance: "0.6 km",
    price: "25-50k",
    cuisine: "Milk Tea",
    image: "https://images.unsplash.com/photo-1572932759882-bb34c848d1b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWJibGUlMjB0ZWElMjBtaWxrJTIwdGVhJTIwZHJpbmt8ZW58MXx8fHwxNzc2MzEzMzUwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    onSale: true,
    discount: "1+1 FREE",
  },
  {
    id: "9",
    name: "Sushi World",
    rating: 4.7,
    reviews: 789,
    distance: "2.5 km",
    price: "100-250k",
    cuisine: "Japanese",
    image: "https://images.unsplash.com/photo-1610379942474-17ac53c6b74a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMGphcGFuZXNlJTIwcGxhdHRlcnxlbnwxfHx8fDE3NzYyNzY1MTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    onSale: true,
    discount: "15% OFF",
  },
  {
    id: "10",
    name: "Cơm Tấm Sườn",
    rating: 4.5,
    reviews: 234,
    distance: "1.0 km",
    price: "40-70k",
    cuisine: "Vietnamese",
    image: "https://images.unsplash.com/photo-1766050587783-1c90751275dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnJva2VuJTIwcmljZSUyMGdyaWxsZWQlMjBwb3JrfGVufDF8fHx8MTc3NjMxMzM0N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    onSale: true,
    discount: "10% OFF",
  },
];

export const todaysFoods: Restaurant[] = [
  {
    id: "11",
    name: "Cơm Tấm Sườn Nướng",
    rating: 4.9,
    reviews: 456,
    distance: "0.4 km",
    price: "40-70k",
    cuisine: "Vietnamese",
    image: "https://images.unsplash.com/photo-1766050587783-1c90751275dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnJva2VuJTIwcmljZSUyMGdyaWxsZWQlMjBwb3JrfGVufDF8fHx8MTc3NjMxMzM0N3ww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "12",
    name: "Bún Chả Hà Nội",
    rating: 4.8,
    reviews: 312,
    distance: "0.6 km",
    price: "45-75k",
    cuisine: "Vietnamese",
    image: "https://images.unsplash.com/photo-1763703544688-2ac7839b0659?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnVuJTIwY2hhJTIwbm9vZGxlc3xlbnwxfHx8fDE3NzYzMTMzNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "13",
    name: "Gỏi Cuốn Tôm Thịt",
    rating: 4.7,
    reviews: 289,
    distance: "0.8 km",
    price: "30-55k",
    cuisine: "Vietnamese",
    image: "https://images.unsplash.com/photo-1656945843375-207bb6e47750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNwcmluZyUyMHJvbGxzJTIwdmlldG5hbWVzZSUyMGZvb2R8ZW58MXx8fHwxNzc2MzEzMzU3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];