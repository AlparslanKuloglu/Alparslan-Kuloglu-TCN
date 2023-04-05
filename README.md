<h1><p align="center"> NestJS, Queue, Redis, API Service </p></h1>


## Proje clone işlemi ve gerekli paketlerin kurulumu

Projeyi git ile kendi localinize klonladıktan sonra;

- npm install ile paketleri yükleyiniz.
- app.module dosyasında import edilen Redis ve Mysql sunucuları için kendi host bilgilerinizi giriniz.

- veritabanı modellerinin senkronize edilmesi için projeyi "npm start" komutu ile ayağa kaldırınız.
- proje ayağa kalktıktan sonra "npx sequelize-cli db:seed:all" komutu ile seederdaki "products" ve "categories" verilerini çekiniz.


## API'yi aşağıdaki endpointler ile kullanabilirsiniz. 

- Kullanıcı kaydet          API (POST): http://localhost:3000/createUser
- Sepete ürün ekle          API (POST): http://localhost:3000/addToCart
- Sipariş oluştur           API (GET): http://localhost:3000/createOrder/:user_id
- Siparişi görüntüle        API (GET): http://localhost:3000/getOrder/:order_id
- Tüm Siparişleri görüntüle API (GET): http://localhost:3000/getAllOrders
- Kampanya Oluştur          API (POST): http://localhost:3000/createOffer
- Yeni Kategori Oluştur     API (POST): http://localhost:3000/createCategory
- Yeni Ürün Oluştur         API (POST): http://localhost:3000/createProduct
- Ürün stoğu güncelle       API (POST): http://localhost:3000/updateProductStok


