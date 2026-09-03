import { getTourPackageBySlug } from "@/actions/tour-package";
import CheckoutClientPage from "@/components/pages/checkout/CheckoutClientPage";

export const metadata = {
  title: "Checkout & Reservation | Royal Safari Tours",
  description: "Secure your luxury expedition and reserve with Royal Safari Tours.",
};

export default async function CheckoutPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const packageSlug = resolvedParams?.package || "";
  const initialGuests = resolvedParams?.guests ? parseInt(resolvedParams.guests) : 1;
  const initialDate = resolvedParams?.date || "";

  let tourPackage = null;
  if (packageSlug) {
    const result = await getTourPackageBySlug(packageSlug);
    if (result?.success && result?.data) {
      tourPackage = result.data;
    }
  }

  return (
    <CheckoutClientPage
      tourPackage={tourPackage}
      initialGuests={initialGuests}
      initialDate={initialDate}
    />
  );
}
