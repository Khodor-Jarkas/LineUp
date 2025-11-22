let mockQueue = [
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
// creating a function to add a customer with his data to the queue
export const addToQueue = (customerData) => {
  const newCustomer = {
    id: Date.now(),
    customerName: customerData.name,
    service: customerData.service,
    status: 'waiting',
    estimatedTime: calculateEstimatedTime(customerData.service),
    phone: customerData.phone,
    email: customerData.email
  };
  // new customer is added to the queue
  mockQueue.push(newCustomer);
  return newCustomer;
};
// status 
export const getQueue = () => {
  return mockQueue;
};
// funtion for the customer position in the queue
export const getQueuePosition = (customerId) => {
  const waitingCustomers = mockQueue.filter(customer => 
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

export default mockQueue;

