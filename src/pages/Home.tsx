import ServicesList from "../components/client/ServicesList";
import PromosList from "../components/client/PromosList";
import AppointmentForm from "../components/client/AppointmentForm";

export default function Home() {
  return (
    <div className="p-6 space-y-8">
      <ServicesList />
      <PromosList />
      <AppointmentForm />
    </div>
  );
}
