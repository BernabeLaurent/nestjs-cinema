import { Price } from './prices.entity';
import { TheaterQuality } from './enums/theaters-qualities.enum';

describe('Price Entity', () => {
  let price: Price;

  beforeEach(() => {
    price = new Price();
  });

  it('should be defined', () => {
    expect(price).toBeDefined();
  });

  it('should have correct properties', () => {
    expect(price).toHaveProperty('id');
    expect(price).toHaveProperty('theaterQuality');
    expect(price).toHaveProperty('price');
  });

  it('should set theaterQuality correctly', () => {
    price.theaterQuality = TheaterQuality.DOLBY_CINEMA;
    expect(price.theaterQuality).toBe(TheaterQuality.DOLBY_CINEMA);
  });

  it('should set price correctly', () => {
    const priceValue = 12.5;
    price.price = priceValue;
    expect(price.price).toBe(priceValue);
  });

  it('should handle different theater qualities', () => {
    const qualities = [
      TheaterQuality.SD,
      TheaterQuality.HD,
      TheaterQuality.FULL_HD,
      TheaterQuality.UHD_4K,
      TheaterQuality.UHD_8K,
      TheaterQuality.IMAX,
      TheaterQuality.DOLBY_CINEMA,
      TheaterQuality.THREE_D,
    ];

    qualities.forEach((quality) => {
      price.theaterQuality = quality;
      expect(price.theaterQuality).toBe(quality);
    });
  });

  it('should handle different price values', () => {
    const prices = [5.0, 8.5, 12.0, 15.5, 20.0, 25.5];

    prices.forEach((priceValue) => {
      price.price = priceValue;
      expect(price.price).toBe(priceValue);
    });
  });

  it('should handle decimal prices', () => {
    price.price = 9.99;
    expect(price.price).toBe(9.99);

    price.price = 12.75;
    expect(price.price).toBe(12.75);
  });

  it('should handle integer prices', () => {
    price.price = 10;
    expect(price.price).toBe(10);

    price.price = 15;
    expect(price.price).toBe(15);
  });
});
