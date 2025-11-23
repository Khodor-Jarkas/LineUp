// function to store and retrieve queue data from localStorage w ba3den we'll just use mysql
export const getStoredQueue = () => {
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
      email: 'mhmddwaked@gmail.com',
      date: '2024-01-15',
      time: '10:00'
    },
    { 
      id: 2, 
      customerName: 'Khodor Jarkas', 
      service: 'Massage', 
      status: 'in-progress',
      estimatedTime: '20-25 min',
      phone: '71 521 233',
      email: 'khodorjarkas@gmail.com',
      date: '2024-01-15',
      time: '10:30'
    },
  ];
};

export const saveQueue = (queue) => {
  localStorage.setItem('lineupQueue', JSON.stringify(queue));
};

// Calculate dynamic wait time based on service type and current queue for that date
export const calculateWaitTime = (service, date, time) => { // Made this exportable
  const currentQueue = getStoredQueue();
  
  // Filter queue for same date and same service type
  const sameDaySameService = currentQueue.filter(customer => 
    customer.date === date && 
    customer.service.toLowerCase() === service.toLowerCase() &&
    (customer.status === 'waiting' || customer.status === 'in-progress')
  );

  // Base service times in minutes
  const baseServiceTimes = {
    haircut: 15,
    manicure: 25,
    massage: 45,
    consultation: 20
  };

  const baseTime = baseServiceTimes[service.toLowerCase()] || 20;
  
  // Calculate total wait time: base time × number of people ahead
  const totalWaitMinutes = sameDaySameService.length * baseTime;
  
  // Convert to readable format
  if (totalWaitMinutes <= baseTime) 
  {
    return `${baseTime}-${baseTime + 10} min`;
  } 
  else if (totalWaitMinutes <= 60) 
  {
    return `${totalWaitMinutes}-${totalWaitMinutes + 10} min`;
  } 
  else 
  {
    const hours = Math.floor(totalWaitMinutes / 60);
    const minutes = totalWaitMinutes % 60;
    return `${hours}h ${minutes}min`;
  }
};

// creating a function to add a customer with his data to the queue
export const addToQueue = (customerData) => {
  const currentQueue = getStoredQueue();
  
  // Calculate dynamic wait time based on current queue for this service and date
  const estimatedWaitTime = calculateWaitTime(customerData.service, customerData.date, customerData.time);
  
  const newCustomer = {
    id: Date.now(), // Use timestamp as unique ID
    customerName: customerData.name,
    service: customerData.service,
    status: 'waiting',
    estimatedTime: estimatedWaitTime,
    phone: customerData.phone,
    email: customerData.email,
    date: customerData.date,
    time: customerData.time,
    joinTime: new Date().toISOString() // Track when they joined
  };
  
  // new customer is added to the queue
  const updatedQueue = [...currentQueue, newCustomer];
  saveQueue(updatedQueue);
  
  // Update wait times for all customers with same service and date
  updateAllWaitTimes(customerData.service, customerData.date);
  
  return newCustomer;
};

// Update wait times for all customers when new customer joins
export const updateAllWaitTimes = (service, date) => { // Made this exportable
  const currentQueue = getStoredQueue();
  
  // Get all customers with same service and date (waiting status)
  const affectedCustomers = currentQueue.filter(customer => 
    customer.date === date && 
    customer.service.toLowerCase() === service.toLowerCase() &&
    customer.status === 'waiting'
  );
  
  // Recalculate wait times for each position
  const updatedQueue = currentQueue.map(customer => {
    if (customer.date === date && customer.service.toLowerCase() === service.toLowerCase() && customer.status === 'waiting') {
      // Find position in queue for this service and date
      const position = affectedCustomers.findIndex(c => c.id === customer.id);
      const baseServiceTimes = {
        haircut: 15,
        manicure: 25,
        massage: 45,
        consultation: 20
      };
      const baseTime = baseServiceTimes[service.toLowerCase()] || 20;
      const totalWaitMinutes = position * baseTime;
      
      let newWaitTime;
      if (totalWaitMinutes <= baseTime) {
        newWaitTime = `${baseTime}-${baseTime + 10} min`;
      } else if (totalWaitMinutes <= 60) {
        newWaitTime = `${totalWaitMinutes}-${totalWaitMinutes + 10} min`;
      } else {
        const hours = Math.floor(totalWaitMinutes / 60);
        const minutes = totalWaitMinutes % 60;
        newWaitTime = `${hours}h ${minutes}min`;
      }
      
      return {
        ...customer,
        estimatedTime: newWaitTime
      };
    }
    return customer;
  });
  
  saveQueue(updatedQueue);
};

// Function to update wait times when a customer is served or removed
export const updateQueueWaitTimes = (service, date) => {
  updateAllWaitTimes(service, date);
};

// status 
export const getQueue = () => {
  return getStoredQueue();
};

// function for the customer position in the queue
export const getQueuePosition = (customerId) => {
  const currentQueue = getStoredQueue();
  const customer = currentQueue.find(c => c.id === customerId);
  
  if (!customer) return null;
  
  // Get all waiting/in-progress customers for the same service and date, sorted by join time
  const waitingCustomers = currentQueue
    .filter(c => 
      c.date === customer.date && 
      c.service.toLowerCase() === customer.service.toLowerCase() &&
      (c.status === 'waiting' || c.status === 'in-progress')
    )
    .sort((a, b) => new Date(a.joinTime) - new Date(b.joinTime));
  
  const position = waitingCustomers.findIndex(c => c.id === customerId) + 1;
  return position > 0 ? position : null;
};

// Get estimated wait time for a specific customer
export const getCustomerWaitTime = (customerId) => {
  const currentQueue = getStoredQueue();
  const customer = currentQueue.find(c => c.id === customerId);
  return customer ? customer.estimatedTime : null;
};

// Get queue statistics for a specific date and service
export const getQueueStats = (date, service) => {
  const currentQueue = getStoredQueue();
  const sameDaySameService = currentQueue.filter(customer => 
    customer.date === date && 
    customer.service.toLowerCase() === service.toLowerCase() &&
    (customer.status === 'waiting' || customer.status === 'in-progress')
  );
  
  return {
    totalCustomers: sameDaySameService.length,
    estimatedWait: sameDaySameService.length > 0 ? sameDaySameService[0].estimatedTime : '0 min',
    averageWait: calculateAverageWait(sameDaySameService)
  };
};

// Made this exportable since it's used in getQueueStats
export const calculateAverageWait = (customers) => {
  if (customers.length === 0) return '0 min';
  
  const baseServiceTimes = {
    haircut: 15,
    manicure: 25,
    massage: 45,
    consultation: 20
  };
  
  const serviceType = customers[0].service.toLowerCase();
  const baseTime = baseServiceTimes[serviceType] || 20;
  const avgWait = Math.ceil((customers.length * baseTime) / 2); // Rough average
  
  return avgWait <= 60 ? `${avgWait} min` : `${Math.floor(avgWait / 60)}h ${avgWait % 60}min`;
};

// For backward compatibility - export the stored queue as default
const mockQueue = getStoredQueue();
export default mockQueue;