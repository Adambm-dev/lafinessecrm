import ServicesList from "../components/client/ServicesList";
import PromosList from "../components/client/PromosList";
import AppointmentForm from "../components/client/AppointmentForm";

export default function Home() {
  return (
    <div>
      <ServicesList />
      <PromosList />
      <AppointmentForm />
    </div>
  );
}
