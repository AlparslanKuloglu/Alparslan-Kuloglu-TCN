import { IsNotEmpty, IsIn, ValidateIf, IsOptional, IsString, IsNumber,Max} from 'class-validator';

export class CreateOfferDTO {

  @IsIn(['author','category','author&category','product', 'total']) // Koşul tipimin belirli değerlerden başka bir değer almamasını kontrol ediyorum.
  @IsNotEmpty()
  @IsString()
  condition_type: string;

  @ValidateIf((obj, value) => obj.condition_type === "author" || obj.condition_type === "author&category"  ) // Eğer koşul tipi yalnızca yazarsa ya da yazar ve kategori ise gerekli olmasını sağlıyorum.
  @IsString()
  @IsNotEmpty()
  author_condition : string

  @ValidateIf((obj, value) => obj.condition_type !==  "total" ) // Eğer koşul total(türü toplam sepet tutarı) değilse gerekli olmasını sağlıyorum çünkü adet şartı geri kalan türlerin tamamı için gerekli. 
  @IsNumber()
  @IsNotEmpty()
  piece_condition: number

  @ValidateIf((obj, value) => obj.condition_type === "category" || obj.condition_type === "author&category" ) // Eğer koşul tipi yalnızca kategoriyse ya da yazar ve kategori ise gerekli olmasını kontrol ediyorum.
  @IsString()
  @IsNotEmpty()
  category_condition: string

  @ValidateIf((obj, value) => obj.condition_type === "total") // Eğer koşul türü total ise gerekli olmasını kontrol ediyorum.
  @IsNumber()
  @IsNotEmpty()
  total_condition: number

  @ValidateIf((obj, value) => obj.condition_type === "product") // Kampanya türü ürün bazındaysa olacaksa ürünün id'si gerekli.
  @IsNumber()
  @IsNotEmpty()
  condition_product_id: number

  @ValidateIf((obj, value) => obj.condition_type !== "total") // Koşul türü total değilse kaç adet ürüne indirim uygulanacağı belirtilmeli.
  @IsNumber()
  @IsNotEmpty()
  discount_piece: number

  @IsNotEmpty()    // İndirim yüzdesi.Her bir tür için gerekli o yüzden herhangi bir validasyon koşulu içermiyor.
  @IsNumber()
  discount_percantage: number;

}