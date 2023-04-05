import { Column, Model, Table, ForeignKey, HasOne, BelongsTo } from 'sequelize-typescript';
import { Product } from './product.model';

@Table
export class Offer extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  offer_id: number;


// CreateOfferDTO'da kontrolünü sağladığım gibi condition_type yalnızca "author","author&category","product" ve "total" değerlerinden birini alabilir.
// total tipinde kampanyanın koşulu belirtilen fiyat ve üzeri bir alışveriş yapmaktır.total_condition'da belirtilir.
// author tipindeki bir kampanyanın koşulu X yazarının Y adetince kitabını/kitaplarını almaktır. X yazarı: author_condition , Y adet koşulu : piece_condition ile belirtilir.
// author&category tipinde de belirli yazar, kategori ve adet belirtilir. author'a ekstra olarak category_condition değeri de eklenir.
// product türündeki kampanya ise X ürününden Y adetince alınma koşuluna bağlıdır.
  @Column
  condition_type: String; 

  @Column
  author_condition: string;

  @Column
  category_condition: string;

  @Column
  piece_condition: number; // adet koşulunu belirtir, product,author ve author&category için girilir.

  @Column
  discount_piece: number; // maksimum kaç adete indirim uygulanacağını belirtir.

  @Column
  total_condition: number;

  @Column
  discount_percantage: number; // uygulanacak indirim yüzdesidir. total için sepet tutarına ,diğerleri için ürün başına uygulanır.

  @ForeignKey(() => Product)
  @Column
  condition_product_id: number;

  @BelongsTo(() => Product)
  product: Product;

}