import Image from "next/image";

export default function CartTable() {
  return (
    <section className="container">
      <div className="grid grid-cols-3">
        <div>
          <div>
            <Image src="/images/pakages/details/3.webp" alt="cart-image" width={500} height={300} />
          </div>
        </div>
      </div>
    </section>
  );
}
