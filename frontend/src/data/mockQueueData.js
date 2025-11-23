// function to store and retrieve queue data from localStorage
const getStoredQueue = () => {
  const stored = localStorage.getItem('lineupQueue');
  if (stored) {
    return JSON.parse(stored);
  }
  // Return initial mock data if nothing in storage
  return [
    { 
      id: 1, 
      customerName: 'mhmd waked', 
      service: 'Haircut', 
      status: 'waiting',
      estimatedTime: '10-15 min',
      phone: '81 86 70 64',
      email: 'mhmddwaked@gmail.com'
    },
    { 
      id: 2, 
      customerName: 'fadel jarkash', 
      service: 'Manicure', 
      status: 'in-progress',
      estimatedTime: '20-25 min',
      phone: '71 521 233',
      email: 'fadeljarkash@gmail.com'
    },
  ];
};

const saveQueue = (queue) => {
  localStorage.setItem('lineupQueue', JSON.stringify(queue));
};

// creating a function to add a customer with his data to the queue
export const addToQueue = (customerData) => {
  const currentQueue = getStoredQueue();
  const newCustomer = {
    id: Date.now(),
    customerName: customerData.name,
    service: customerData.service,
    status: 'waiting',
    estimatedTime: waitingTimeEstimation(customerData.service),
    phone: customerData.phone,
    email: customerData.email
  };
  // new customer is added to the queue
  const updatedQueue = [...currentQueue, newCustomer];
  saveQueue(updatedQueue);
  return newCustomer;
};

// status 
export const getQueue = () => {
  return getStoredQueue();
};

// funtion for the customer position in the queue
export const getQueuePosition = (customerId) => {
  const currentQueue = getStoredQueue();
  const waitingCustomers = currentQueue.filter(customer => 
    customer.status === 'waiting' || customer.status === 'in-progress'
  );
  return waitingCustomers.findIndex(customer => customer.id === customerId) + 1;
};

// waiting time estimation according to the service type
const waitingTimeEstimation = (service) => {
  const timeMap = {
    haircut: '10-15 min',
    manicure: '20-25 min',
    massage: '30-45 min',
    consultation: '15-20 min'
  };
  return timeMap[service] || '15-20 min';
};

// For backward compatibility
const mockQueue = getStoredQueue();
export default mockQueue;