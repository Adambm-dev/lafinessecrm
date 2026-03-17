import { useState } from 'react';

// Types
type Service = {
  id: string;
  name: string;
  price: number;
  duration: number;
  category: string;
};

type Promo = {
  id: string;
  title: string;
  description: string;
  discount: number;
  validUntil: string;
  active: boolean;
};

type Appointment = {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'pending' | 'accepted' | 'refused' | 'rescheduled';
  notes: string;
};

type StockItem = {
  id: string;
  name: string;
  quantity: number;
  minQuantity: number;
  category: string;
};

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  // Data states
  const [services, setServices] = useState<Service[]>([
    { id: '1', name: 'Coupe Femme', price: 35, duration: 60, category: 'Coiffure' },
    { id: '2', name: 'Brushing', price: 25, duration: 45, category: 'Coiffure' },
    { id: '3', name: 'Coloration', price: 60, duration: 120, category: 'Coiffure' },
    { id: '4', name: 'Manucure Complète', price: 20, duration: 45, category: 'Ongles' },
    { id: '5', name: 'Pédicure', price: 30, duration: 60, category: 'Ongles' },
    { id: '6', name: 'Pose de Vernis Semi-Permanent', price: 25, duration: 45, category: 'Ongles' },
    { id: '7', name: 'Soins du Visage', price: 50, duration: 90, category: 'Soins' },
    { id: '8', name: 'Massage Relaxant', price: 60, duration: 60, category: 'Soins' },
    { id: '9', name: 'Épilation Cire', price: 15, duration: 30, category: 'Épilation' },
    { id: '10', name: 'Épilation Définitive', price: 80, duration: 90, category: 'Épilation' },
  ]);

  const [promos, setPromos] = useState<Promo[]>([
    { id: '1', title: 'Offre Spéciale Mariage', description: '15% de réduction sur le package complet mariage', discount: 15, validUntil: '2024-12-31', active: true },
    { id: '2', title: 'Première Visite', description: '10% de réduction sur votre premier soin', discount: 10, validUntil: '2024-06-30', active: true },
    { id: '3', title: 'Offre Été', description: '20% sur tous les soins du visage', discount: 20, validUntil: '2024-08-31', active: false },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', clientName: 'Sophie Martin', clientPhone: '0612345678', clientEmail: 'sophie@email.com', serviceId: '1', serviceName: 'Coupe Femme', date: '2024-05-20', time: '10:00', status: 'pending', notes: '' },
    { id: '2', clientName: 'Amel Ben Salem', clientPhone: '0687654321', clientEmail: 'amel@email.com', serviceId: '7', serviceName: 'Soins du Visage', date: '2024-05-21', time: '14:30', status: 'accepted', notes: '' },
    { id: '3', clientName: 'Lea Dubois', clientPhone: '0698765432', clientEmail: 'lea@email.com', serviceId: '4', serviceName: 'Manucure Complète', date: '2024-05-19', time: '16:00', status: 'refused', notes: 'Client indisponible' },
  ]);

  const [stock, setStock] = useState<StockItem[]>([
    { id: '1', name: 'Shampoing Bio', quantity: 15, minQuantity: 5, category: 'Produits' },
    { id: '2', name: 'Crème Hydratante', quantity: 3, minQuantity: 5, category: 'Produits' },
    { id: '3', name: 'Vernis à Ongles', quantity: 25, minQuantity: 10, category: 'Produits' },
    { id: '4', name: 'Huile Essentielle', quantity: 8, minQuantity: 5, category: 'Produits' },
    { id: '5', name: 'Cire d\'Épilation', quantity: 2, minQuantity: 5, category: 'Produits' },
  ]);

  // Form states for client
  const [appointmentForm, setAppointmentForm] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    serviceId: '',
    date: '',
    time: '',
    notes: ''
  });

  // Form states for admin
  const [activeTab, setActiveTab] = useState('appointments');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService] = useState({ name: '', price: '', duration: '', category: '' });
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [newPromo, setNewPromo] = useState({ title: '', description: '', discount: '', validUntil: '', active: true });
  const [editingStock, setEditingStock] = useState<StockItem | null>(null);
  const [newStock, setNewStock] = useState({ name: '', quantity: '', minQuantity: '', category: '' });
  const [rescheduleAppointment, setRescheduleAppointment] = useState<{id: string, date: string, time: string} | null>(null);

  // Password check
  const handleAdminLogin = () => {
    if (adminPassword === 'admin123') {
      setIsAdminMode(true);
      setShowPasswordModal(false);
      setAdminPassword('');
      setPasswordError('');
    } else {
      setPasswordError('Mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    setIsAdminMode(false);
    setActiveTab('appointments');
  };

  // Client functions
  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentForm.serviceId || !appointmentForm.date || !appointmentForm.time) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const service = services.find(s => s.id === appointmentForm.serviceId);
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      clientName: appointmentForm.clientName,
      clientPhone: appointmentForm.clientPhone,
      clientEmail: appointmentForm.clientEmail,
      serviceId: appointmentForm.serviceId,
      serviceName: service?.name || 'Service inconnu',
      date: appointmentForm.date,
      time: appointmentForm.time,
      status: 'pending',
      notes: appointmentForm.notes
    };

    setAppointments([...appointments, newAppointment]);
    setAppointmentForm({
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      serviceId: '',
      date: '',
      time: '',
      notes: ''
    });
    alert('Votre demande de rendez-vous a été envoyée avec succès !');
  };

  // Admin functions
  const handleAcceptAppointment = (id: string) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: 'accepted' } : app
    ));
  };

  const handleRefuseAppointment = (id: string) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: 'refused' } : app
    ));
  };

  const handleReschedule = (id: string) => {
    if (rescheduleAppointment && rescheduleAppointment.id === id) {
      setAppointments(appointments.map(app => 
        app.id === id ? { ...app, date: rescheduleAppointment.date, time: rescheduleAppointment.time, status: 'rescheduled' } : app
      ));
      setRescheduleAppointment(null);
      alert('Rendez-vous reprogrammé avec succès !');
    }
  };

  const handleSaveService = () => {
    if (!newService.name || !newService.price || !newService.duration || !newService.category) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const service: Service = {
      id: editingService ? editingService.id : Date.now().toString(),
      name: newService.name,
      price: parseFloat(newService.price),
      duration: parseInt(newService.duration),
      category: newService.category
    };

    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? service : s));
      setEditingService(null);
    } else {
      setServices([...services, service]);
    }
    setNewService({ name: '', price: '', duration: '', category: '' });
  };

  const handleDeleteService = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const handleSavePromo = () => {
    if (!newPromo.title || !newPromo.discount || !newPromo.validUntil) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const promo: Promo = {
      id: editingPromo ? editingPromo.id : Date.now().toString(),
      title: newPromo.title,
      description: newPromo.description,
      discount: parseFloat(newPromo.discount),
      validUntil: newPromo.validUntil,
      active: newPromo.active
    };

    if (editingPromo) {
      setPromos(promos.map(p => p.id === editingPromo.id ? promo : p));
      setEditingPromo(null);
    } else {
      setPromos([...promos, promo]);
    }
    setNewPromo({ title: '', description: '', discount: '', validUntil: '', active: true });
  };

  const handleDeletePromo = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
      setPromos(promos.filter(p => p.id !== id));
    }
  };

  const handleTogglePromo = (id: string) => {
    setPromos(promos.map(p => 
      p.id === id ? { ...p, active: !p.active } : p
    ));
  };

  const handleSaveStock = () => {
    if (!newStock.name || !newStock.quantity || !newStock.minQuantity || !newStock.category) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const item: StockItem = {
      id: editingStock ? editingStock.id : Date.now().toString(),
      name: newStock.name,
      quantity: parseInt(newStock.quantity),
      minQuantity: parseInt(newStock.minQuantity),
      category: newStock.category
    };

    if (editingStock) {
      setStock(stock.map(s => s.id === editingStock.id ? item : s));
      setEditingStock(null);
    } else {
      setStock([...stock, item]);
    }
    setNewStock({ name: '', quantity: '', minQuantity: '', category: '' });
  };

  const handleDeleteStock = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      setStock(stock.filter(s => s.id !== id));
    }
  };

  const handleUpdateStockQuantity = (id: string, delta: number) => {
    setStock(stock.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    ));
  };

  const categories = [...new Set(services.map(s => s.category))];
  const activePromos = promos.filter(p => p.active);
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const acceptedAppointments = appointments.filter(a => a.status === 'accepted');
  const lowStockItems = stock.filter(s => s.quantity <= s.minQuantity);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">✨ La Finesse by Nourhen</h1>
              <p className="text-pink-100 mt-1">Centre de Beauté & Bien-être</p>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-white text-pink-600 px-4 py-2 rounded-full font-semibold hover:bg-pink-50 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Espace Admin
            </button>
          </div>
        </div>
      </header>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Espace Administrateur</h3>
            <p className="text-gray-600 mb-4">Veuillez entrer le mot de passe pour accéder à l'administration.</p>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent mb-4"
            />
            {passwordError && <p className="text-red-500 text-sm mb-4">{passwordError}</p>}
            <div className="flex gap-3">
              <button
                onClick={handleAdminLogin}
                className="flex-1 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
              >
                Se connecter
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setAdminPassword('');
                  setPasswordError('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        {isAdminMode ? (
          // ADMIN MODE
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">👩‍💼 Espace Administrateur</h2>
              <button
                onClick={handleLogout}
                className="bg-white text-pink-600 px-4 py-2 rounded-lg font-semibold hover:bg-pink-50 transition-colors"
              >
                Déconnexion
              </button>
            </div>

            {/* Admin Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('appointments')}
                className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                  activeTab === 'appointments' 
                    ? 'bg-pink-50 text-pink-600 border-b-2 border-pink-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Rendez-vous ({pendingAppointments.length})
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                  activeTab === 'services' 
                    ? 'bg-pink-50 text-pink-600 border-b-2 border-pink-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Services & Tarifs
              </button>
              <button
                onClick={() => setActiveTab('promos')}
                className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                  activeTab === 'promos' 
                    ? 'bg-pink-50 text-pink-600 border-b-2 border-pink-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Promotions
              </button>
              <button
                onClick={() => setActiveTab('stock')}
                className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                  activeTab === 'stock' 
                    ? 'bg-pink-50 text-pink-600 border-b-2 border-pink-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Stock ({lowStockItems.length} alertes)
              </button>
            </div>

            <div className="p-6">
              {/* Appointments Tab */}
              {activeTab === 'appointments' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Gestion des Rendez-vous</h3>
                  
                  {pendingAppointments.length === 0 && acceptedAppointments.length === 0 && (
                    <p className="text-gray-500 text-center py-8">Aucun rendez-vous</p>
                  )}

                  {pendingAppointments.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-yellow-600 mb-4">En attente ({pendingAppointments.length})</h4>
                      <div className="space-y-4">
                        {pendingAppointments.map(app => (
                          <div key={app.id} className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="font-semibold text-gray-800">{app.clientName}</p>
                                <p className="text-sm text-gray-600">{app.clientPhone} • {app.clientEmail}</p>
                              </div>
                              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">En attente</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-sm text-gray-600">Service</p>
                                <p className="font-medium">{app.serviceName}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Date & Heure</p>
                                <p className="font-medium">{app.date} à {app.time}</p>
                              </div>
                            </div>
                            {app.notes && <p className="text-sm text-gray-600 italic mb-3">Notes: {app.notes}</p>}
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAcceptAppointment(app.id)}
                                className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                              >
                                Accepter
                              </button>
                              <button
                                onClick={() => handleRefuseAppointment(app.id)}
                                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                              >
                                Refuser
                              </button>
                              <button
                                onClick={() => setRescheduleAppointment({ id: app.id, date: app.date, time: app.time })}
                                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                Décaler
                              </button>
                            </div>
                            {rescheduleAppointment?.id === app.id && (
                              <div className="mt-3 p-3 bg-white rounded-lg">
                                <input
                                  type="date"
                                  value={rescheduleAppointment.date}
                                  onChange={(e) => setRescheduleAppointment({ ...rescheduleAppointment, date: e.target.value })}
                                  className="mr-2 px-2 py-1 border rounded"
                                />
                                <input
                                  type="time"
                                  value={rescheduleAppointment.time}
                                  onChange={(e) => setRescheduleAppointment({ ...rescheduleAppointment, time: e.target.value })}
                                  className="mr-2 px-2 py-1 border rounded"
                                />
                                <button
                                  onClick={() => handleReschedule(app.id)}
                                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                >
                                  Valider
                                </button>
                                <button
                                  onClick={() => setRescheduleAppointment(null)}
                                  className="ml-2 bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                                >
                                  Annuler
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {acceptedAppointments.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-green-600 mb-4">Acceptés ({acceptedAppointments.length})</h4>
                      <div className="space-y-4">
                        {acceptedAppointments.map(app => (
                          <div key={app.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-gray-800">{app.clientName}</p>
                                <p className="text-sm text-gray-600">{app.clientPhone} • {app.clientEmail}</p>
                                <p className="text-sm text-gray-600 mt-1">Service: {app.serviceName}</p>
                                <p className="text-sm text-gray-600">Date: {app.date} à {app.time}</p>
                              </div>
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Accepté</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Services Tab */}
              {activeTab === 'services' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Gestion des Services & Tarifs</h3>
                    <button
                      onClick={() => {
                        setEditingService(null);
                        setNewService({ name: '', price: '', duration: '', category: '' });
                      }}
                      className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                    >
                      + Ajouter un service
                    </button>
                  </div>

                  {(editingService || newService.name || newService.price) && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h4 className="font-semibold mb-4">{editingService ? 'Modifier' : 'Ajouter'} un service</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Nom du service"
                          value={editingService ? editingService.name : newService.name}
                          onChange={(e) => editingService ? setEditingService({ ...editingService, name: e.target.value }) : setNewService({ ...newService, name: e.target.value })}
                          className="px-3 py-2 border rounded-lg"
                        />
                        <input
                          type="number"
                          placeholder="Prix (€)"
                          value={editingService ? editingService.price : newService.price}
                          onChange={(e) => editingService ? setEditingService({ ...editingService, price: parseFloat(e.target.value) }) : setNewService({ ...newService, price: e.target.value })}
                          className="px-3 py-2 border rounded-lg"
                        />
                        <input
                          type="number"
                          placeholder="Durée (minutes)"
                          value={editingService ? editingService.duration : newService.duration}
                          onChange={(e) => editingService ? setEditingService({ ...editingService, duration: parseInt(e.target.value) }) : setNewService({ ...newService, duration: e.target.value })}
                          className="px-3 py-2 border rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Catégorie"
                          value={editingService ? editingService.category : newService.category}
                          onChange={(e) => editingService ? setEditingService({ ...editingService, category: e.target.value }) : setNewService({ ...newService, category: e.target.value })}
                          className="px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={handleSaveService}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                          Enregistrer
                        </button>
                        <button
                          onClick={() => {
                            setEditingService(null);
                            setNewService({ name: '', price: '', duration: '', category: '' });
                          }}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map(service => (
                      <div key={service.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-800">{service.name}</h4>
                          <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs">{service.category}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-2xl font-bold text-pink-600">{service.price}€</p>
                            <p className="text-sm text-gray-500">{service.duration} min</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingService(service)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteService(service.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Promos Tab */}
              {activeTab === 'promos' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Gestion des Promotions</h3>
                    <button
                      onClick={() => {
                        setEditingPromo(null);
                        setNewPromo({ title: '', description: '', discount: '', validUntil: '', active: true });
                      }}
                      className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                    >
                      + Ajouter une promo
                    </button>
                  </div>

                  {(editingPromo || newPromo.title) && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h4 className="font-semibold mb-4">{editingPromo ? 'Modifier' : 'Ajouter'} une promotion</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Titre"
                          value={editingPromo ? editingPromo.title : newPromo.title}
                          onChange={(e) => editingPromo ? setEditingPromo({ ...editingPromo, title: e.target.value }) : setNewPromo({ ...newPromo, title: e.target.value })}
                          className="px-3 py-2 border rounded-lg"
                        />
                        <input
                          type="number"
                          placeholder="Pourcentage de réduction (%)"
                          value={editingPromo ? editingPromo.discount : newPromo.discount}
                          onChange={(e) => editingPromo ? setEditingPromo({ ...editingPromo, discount: parseFloat(e.target.value) }) : setNewPromo({ ...newPromo, discount: e.target.value })}
                          className="px-3 py-2 border rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Description"
                          value={editingPromo ? editingPromo.description : newPromo.description}
                          onChange={(e) => editingPromo ? setEditingPromo({ ...editingPromo, description: e.target.value }) : setNewPromo({ ...newPromo, description: e.target.value })}
                          className="md:col-span-2 px-3 py-2 border rounded-lg"
                        />
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin de validité</label>
                          <input
                            type="date"
                            value={editingPromo ? editingPromo.validUntil : newPromo.validUntil}
                            onChange={(e) => editingPromo ? setEditingPromo({ ...editingPromo, validUntil: e.target.value }) : setNewPromo({ ...newPromo, validUntil: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={editingPromo ? editingPromo.active : newPromo.active}
                              onChange={(e) => editingPromo ? setEditingPromo({ ...editingPromo, active: e.target.checked }) : setNewPromo({ ...newPromo, active: e.target.checked })}
                              className="mr-2"
                            />
                            Active
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={handleSavePromo}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                          Enregistrer
                        </button>
                        <button
                          onClick={() => {
                            setEditingPromo(null);
                            setNewPromo({ title: '', description: '', discount: '', validUntil: '', active: true });
                          }}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {promos.map(promo => (
                      <div key={promo.id} className={`border rounded-lg p-4 ${promo.active ? 'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200' : 'bg-gray-50'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-800">{promo.title}</h4>
                            <p className="text-sm text-gray-600">{promo.description}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${promo.active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                            {promo.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <div>
                            <p className="text-2xl font-bold text-pink-600">-{promo.discount}%</p>
                            <p className="text-sm text-gray-500">Valide jusqu'au {promo.validUntil}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleTogglePromo(promo.id)}
                              className={`px-3 py-1 rounded text-sm ${promo.active ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
                            >
                              {promo.active ? 'Désactiver' : 'Activer'}
                            </button>
                            <button
                              onClick={() => setEditingPromo(promo)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeletePromo(promo.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Tab */}
              {activeTab === 'stock' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Gestion du Stock</h3>
                    <button
                      onClick={() => {
                        setEditingStock(null);
                        setNewStock({ name: '', quantity: '', minQuantity: '', category: '' });
                      }}
                      className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                    >
                      + Ajouter un article
                    </button>
                  </div>

                  {lowStockItems.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-red-800 mb-2">⚠️ Alertes Stock Faible</h4>
                      <ul className="list-disc list-inside text-red-700">
                        {lowStockItems.map(item => (
                          <li key={item.id}>{item.name}: {item.quantity} restants (min: {item.minQuantity})</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(editingStock || newStock.name || newStock.quantity) && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h4 className="font-semibold mb-4">{editingStock ? 'Modifier' : 'Ajouter'} un article</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Nom de l'article"
                          value={editingStock ? editingStock.name : newStock.name}
                          onChange={(e) => editingStock ? setEditingStock({ ...editingStock, name: e.target.value }) : setNewStock({ ...newStock, name: e.target.value })}
                          className="px-3 py-2 border rounded-lg"
                        />
                        <input
                          type="number"
                          placeholder="Quantité"
                          value={editingStock ? editingStock.quantity : newStock.quantity}
                          onChange={(e) => editingStock ? setEditingStock({ ...editingStock, quantity: parseInt(e.target.value) }) : setNewStock({ ...newStock, quantity: e.target.value })}
                          className="px-3 py-2 border rounded-lg"
                        />
                        <input
                          type="number"
                          placeholder="Quantité minimale"
                          value={editingStock ? editingStock.minQuantity : newStock.minQuantity}
                          onChange={(e) => editingStock ? setEditingStock({ ...editingStock, minQuantity: parseInt(e.target.value) }) : setNewStock({ ...newStock, minQuantity: e.target.value })}
                          className="px-3 py-2 border rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Catégorie"
                          value={editingStock ? editingStock.category : newStock.category}
                          onChange={(e) => editingStock ? setEditingStock({ ...editingStock, category: e.target.value }) : setNewStock({ ...newStock, category: e.target.value })}
                          className="px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={handleSaveStock}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                          Enregistrer
                        </button>
                        <button
                          onClick={() => {
                            setEditingStock(null);
                            setNewStock({ name: '', quantity: '', minQuantity: '', category: '' });
                          }}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stock.map(item => (
                      <div key={item.id} className={`border rounded-lg p-4 ${item.quantity <= item.minQuantity ? 'bg-red-50 border-red-200' : 'hover:shadow-lg'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-800">{item.name}</h4>
                          <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs">{item.category}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-2xl font-bold text-gray-800">{item.quantity}</p>
                            <p className="text-sm text-gray-500">Restants</p>
                            {item.quantity <= item.minQuantity && (
                              <p className="text-xs text-red-600 font-semibold">⚠️ Stock faible</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateStockQuantity(item.id, -1)}
                              className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                            >
                              -
                            </button>
                            <button
                              onClick={() => handleUpdateStockQuantity(item.id, 1)}
                              className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                            >
                              +
                            </button>
                            <button
                              onClick={() => setEditingStock(item)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteStock(item.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // CLIENT MODE
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Bienvenue chez La Finesse by Nourhen</h2>
              <p className="text-gray-600 text-lg">Découvrez nos services de beauté et prenez rendez-vous en ligne</p>
            </div>

            {/* Promotions */}
            {activePromos.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🎉 Nos Promotions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activePromos.map(promo => (
                    <div key={promo.id} className="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-pink-800">{promo.title}</h3>
                        <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          -{promo.discount}%
                        </span>
                      </div>
                      <p className="text-gray-700 mb-4">{promo.description}</p>
                      <p className="text-sm text-pink-600 font-semibold">Valide jusqu'au {promo.validUntil}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services & Prices */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">💆 Nos Services & Tarifs</h2>
              {categories.map(category => (
                <div key={category} className="mb-8">
                  <h3 className="text-xl font-semibold text-pink-600 mb-4">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.filter(s => s.category === category).map(service => (
                      <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-800">{service.name}</h4>
                            <p className="text-sm text-gray-500">{service.duration} minutes</p>
                          </div>
                          <p className="text-2xl font-bold text-pink-600">{service.price}€</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Request Appointment */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📅 Demander un Rendez-vous</h2>
              <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                    <input
                      type="text"
                      required
                      value={appointmentForm.clientName}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, clientName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                    <input
                      type="tel"
                      required
                      value={appointmentForm.clientPhone}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, clientPhone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={appointmentForm.clientEmail}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, clientEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service *</label>
                  <select
                    required
                    value={appointmentForm.serviceId}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, serviceId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez un service</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name} - {service.price}€ ({service.duration} min)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      value={appointmentForm.date}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heure *</label>
                    <input
                      type="time"
                      required
                      value={appointmentForm.time}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
                  <textarea
                    value={appointmentForm.notes}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-700 transition-all transform hover:scale-105"
                >
                  Envoyer la demande de rendez-vous
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-pink-500 to-rose-600 text-white mt-12 py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 La Finesse by Nourhen - Centre de Beauté & Bien-être</p>
          <p className="text-pink-100 text-sm mt-1">Mot de passe admin: admin123</p>
        </div>
      </footer>
    </div>
  );
}
