import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, delay } from 'rxjs';
import { environment } from '../../environments/environment';

export const mockServerInterceptor: HttpInterceptorFn = (req, next) => {
  const { url, method } = req;
    console.log('entro')
  if (url.includes('/me') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: {
        id: 'user-1',
        email: 'trainer@gym.com',
        firstName: 'Carlos',
        lastName: 'Trainer',
        role: 'trainer',
        gyms: ['gym-1', 'gym-2']
      }
    })).pipe(delay(300));
  }

  if (url.includes('/me') && method === 'PUT') {
    return of(new HttpResponse({
      status: 200,
      body: req.body
    })).pipe(delay(300));
  }

  if (url.includes('/gyms') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: getMockGyms()
    })).pipe(delay(300));
  }

  if (url.includes('/students') && method === 'GET' && !url.match(/students\/[^/]+$/)) {
    return of(new HttpResponse({
      status: 200,
      body: getMockStudents()
    })).pipe(delay(300));
  }

  if (url.match(/students\/[^/]+$/) && method === 'GET') {
      console.log('entro');
    const id = url.split('/').pop();
    const students = getMockStudents();
    const student = students.find(s => s.id === id);
    return of(new HttpResponse({
      status: student ? 200 : 404,
      body: student || { error: 'Not found' }
    })).pipe(delay(300));
  }

  if (url.includes('/students') && method === 'POST') {
    return of(new HttpResponse({
      status: 201,
      body: { ...(req.body as any), id: 'student-' + Date.now() }
    })).pipe(delay(300));
  }

  if (url.includes('/exercises') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: getMockExercises()
    })).pipe(delay(300));
  }

  if (url.includes('/exercises') && method === 'POST') {
    return of(new HttpResponse({
      status: 201,
      body: { ...(req.body as any), id: 'exercise-' + Date.now() }
    })).pipe(delay(300));
  }

  if (url.includes('/routines') && method === 'GET' && !url.match(/routines\/[^/]+$/)) {
    return of(new HttpResponse({
      status: 200,
      body: getMockRoutines()
    })).pipe(delay(300));
  }

  if (url.match(/routines\/[^/]+$/) && method === 'GET') {
    const id = url.split('/').pop();
    const routines = getMockRoutines();
    const routine = routines.find(r => r.id === id);
    return of(new HttpResponse({
      status: routine ? 200 : 404,
      body: routine || { error: 'Not found' }
    })).pipe(delay(300));
  }

  if (url.includes('/routines') && method === 'POST') {
    return of(new HttpResponse({
      status: 201,
      body: { ...(req.body as any), id: 'routine-' + Date.now() }
    })).pipe(delay(300));
  }

  if (url.includes('/routines') && url.includes('/assign') && method === 'POST') {
    return of(new HttpResponse({
      status: 200,
      body: { success: true }
    })).pipe(delay(300));
  }

  if (url.includes('/comments') && method === 'POST') {
    return of(new HttpResponse({
      status: 201,
      body: { ...(req.body as any), id: 'comment-' + Date.now(), createdAt: new Date().toISOString() }
    })).pipe(delay(300));
  }

  if (url.includes('/comments') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: []
    })).pipe(delay(300));
  }

  if (url.includes('/payments/create') && method === 'POST') {
    return of(new HttpResponse({
      status: 200,
      body: {
        id: 'pref-' + Date.now(),
        checkoutUrl: 'https://www.mercadopago.com.ar/checkout/mock?preference-id=pref-' + Date.now()
      }
    })).pipe(delay(300));
  }

  if (url.includes('/blocks') && method === 'GET' && !url.match(/blocks\/[^/]+$/)) {
    return of(new HttpResponse({
      status: 200,
      body: getMockBlocks()
    })).pipe(delay(300));
  }

  if (url.match(/blocks\/[^/]+$/) && method === 'GET') {
    const id = url.split('/').pop();
    const blocks = getMockBlocks();
    const block = blocks.find(b => b.id === id);
    return of(new HttpResponse({
      status: block ? 200 : 404,
      body: block || { error: 'Not found' }
    })).pipe(delay(300));
  }

  if (url.includes('/blocks') && method === 'POST') {
    return of(new HttpResponse({
      status: 201,
      body: { ...(req.body as any), id: 'block-' + Date.now(), createdAt: new Date().toISOString() }
    })).pipe(delay(300));
  }

  if (url.match(/blocks\/[^/]+$/) && method === 'PUT') {
    return of(new HttpResponse({
      status: 200,
      body: { ...(req.body as any), updatedAt: new Date().toISOString() }
    })).pipe(delay(300));
  }

  if (url.match(/blocks\/[^/]+$/) && method === 'DELETE') {
    return of(new HttpResponse({
      status: 204,
      body: null
    })).pipe(delay(300));
  }

  if (url.includes('/blocks') && url.includes('/duplicate') && method === 'POST') {
    const id = url.split('/')[url.split('/').indexOf('blocks') + 1];
    const blocks = getMockBlocks();
    const original = blocks.find(b => b.id === id);
    if (original) {
      return of(new HttpResponse({
        status: 201,
        body: { ...original, id: 'block-' + Date.now(), name: original.name + ' (Copia)' }
      })).pipe(delay(300));
    }
  }

  if (url.match(/exercises\/[^/]+$/) && method === 'PUT') {
    return of(new HttpResponse({
      status: 200,
      body: { ...(req.body as any), updatedAt: new Date().toISOString() }
    })).pipe(delay(300));
  }

  if (url.match(/exercises\/[^/]+$/) && method === 'DELETE') {
    return of(new HttpResponse({
      status: 204,
      body: null
    })).pipe(delay(300));
  }

  if (url.match(/routines\/[^/]+$/) && method === 'PUT') {
    return of(new HttpResponse({
      status: 200,
      body: { ...(req.body as any), updatedAt: new Date().toISOString() }
    })).pipe(delay(300));
  }

  if (url.includes('/routines') && url.includes('/duplicate') && method === 'POST') {
    const id = url.split('/')[url.split('/').indexOf('routines') + 1];
    const routines = getMockRoutines();
    const original = routines.find(r => r.id === id);
    if (original) {
      return of(new HttpResponse({
        status: 201,
        body: { ...original, id: 'routine-' + Date.now(), name: original.name + ' (Copia)' }
      })).pipe(delay(300));
    }
  }

  if (url.includes('/payments/packs') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: getMockPaymentPacks()
    })).pipe(delay(300));
  }

  if (url.includes('/payments/history') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: getMockPaymentHistory()
    })).pipe(delay(300));
  }

  if (url.includes('/trainer/payments') && method === 'GET' && !url.match(/trainer\/payments\/[^/]+$/)) {
    const trainerId = 'user-1';
    const allPayments = getMockTrainerPayments();
    let filteredPayments = allPayments.filter(p => p.trainerId === trainerId);

    const urlObj = new URL('http://dummy' + url);
    const studentId = urlObj.searchParams.get('studentId');
    const status = urlObj.searchParams.get('status');
    const dateFrom = urlObj.searchParams.get('dateFrom');
    const dateTo = urlObj.searchParams.get('dateTo');

    if (studentId) {
      filteredPayments = filteredPayments.filter(p => p.studentId === studentId);
    }
    if (status) {
      filteredPayments = filteredPayments.filter(p => p.status === status);
    }
    if (dateFrom) {
      filteredPayments = filteredPayments.filter(p => new Date(p.paymentDate) >= new Date(dateFrom));
    }
    if (dateTo) {
      filteredPayments = filteredPayments.filter(p => new Date(p.paymentDate) <= new Date(dateTo));
    }

    return of(new HttpResponse({
      status: 200,
      body: filteredPayments
    })).pipe(delay(300));
  }

  if (url.match(/trainer\/payments\/[^/]+$/) && method === 'GET') {
    const id = url.split('/').pop();
    const payments = getMockTrainerPayments();
    const payment = payments.find(p => p.id === id);
    return of(new HttpResponse({
      status: payment ? 200 : 404,
      body: payment || { error: 'Not found' }
    })).pipe(delay(300));
  }

  if (url.includes('/trainer/payments') && method === 'POST') {
    const newPayment = {
      ...(req.body as any),
      id: 'payment-' + Date.now(),
      trainerId: 'user-1',
      createdAt: new Date().toISOString()
    };
    return of(new HttpResponse({
      status: 201,
      body: newPayment
    })).pipe(delay(300));
  }

  if (url.includes('/metrics/dashboard') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: {
        kpis: { totalStudents: 34, routinesCreated: 12, exercisesUsed: 87, routinesAssigned: 28 },
        routinesByMonth: [
          { month: 'Ene', count: 2 }, { month: 'Feb', count: 3 }, { month: 'Mar', count: 1 },
          { month: 'Abr', count: 2 }, { month: 'May', count: 1 }, { month: 'Jun', count: 1 },
          { month: 'Jul', count: 1 }, { month: 'Ago', count: 0 }, { month: 'Sep', count: 1 }, { month: 'Oct', count: 0 }
        ],
        exercisesByType: [
          { type: 'Fuerza', count: 45 }, { type: 'Cardio', count: 18 },
          { type: 'Flexibilidad', count: 12 }, { type: 'Core', count: 8 }, { type: 'Balance', count: 4 }
        ],
        averageAttendance: [
          { week: 'Sem 1', attendance: 78 }, { week: 'Sem 2', attendance: 82 },
          { week: 'Sem 3', attendance: 75 }, { week: 'Sem 4', attendance: 88 },
          { week: 'Sem 5', attendance: 85 }, { week: 'Sem 6', attendance: 90 },
          { week: 'Sem 7', attendance: 87 }, { week: 'Sem 8', attendance: 92 }
        ]
      }
    })).pipe(delay(300));
  }

  if (url.includes('/metrics/progress') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: {
        weightHistory: [
          { date: '2025-05-01', value: 85.5 }, { date: '2025-06-01', value: 84.2 },
          { date: '2025-07-01', value: 83.8 }, { date: '2025-08-01', value: 82.9 },
          { date: '2025-09-01', value: 82.1 }, { date: '2025-10-01', value: 82.5 }
        ],
        strengthHistory: [
          { exercise: 'Press de Banca', data: [
            { date: '2025-05-01', value: 55 }, { date: '2025-06-01', value: 57.5 },
            { date: '2025-07-01', value: 60 }, { date: '2025-08-01', value: 62.5 },
            { date: '2025-09-01', value: 62.5 }, { date: '2025-10-01', value: 65 }
          ]},
          { exercise: 'Sentadilla', data: [
            { date: '2025-05-01', value: 70 }, { date: '2025-06-01', value: 75 },
            { date: '2025-07-01', value: 80 }, { date: '2025-08-01', value: 85 },
            { date: '2025-09-01', value: 87.5 }, { date: '2025-10-01', value: 90 }
          ]}
        ],
        attendanceHistory: [
          { week: '2025-W35', sessions: 3 }, { week: '2025-W36', sessions: 4 },
          { week: '2025-W37', sessions: 3 }, { week: '2025-W38', sessions: 4 },
          { week: '2025-W39', sessions: 3 }, { week: '2025-W40', sessions: 4 },
          { week: '2025-W41', sessions: 5 }, { week: '2025-W42', sessions: 4 }
        ],
        goals: [
          { id: 'goal-1', title: 'Perder 5kg', type: 'weight', target: 80, current: 82.5, progress: 60 },
          { id: 'goal-2', title: 'Press de Banca 70kg', type: 'strength', target: 70, current: 65, progress: 67 },
          { id: 'goal-3', title: '4 sesiones/semana', type: 'attendance', target: 4, current: 3.5, progress: 88 }
        ]
      }
    })).pipe(delay(300));
  }

  if (url.includes('/metrics') && method === 'GET' && !url.includes('/dashboard') && !url.includes('/progress')) {
    return of(new HttpResponse({
      status: 200,
      body: getMockMetrics()
    })).pipe(delay(300));
  }

  if (url.includes('/trainer/payment-plans') && method === 'GET' && !url.match(/payment-plans\/[^/]+/) && !url.includes('/assign')) {
    return of(new HttpResponse({
      status: 200,
      body: getMockPaymentPlanTemplates()
    })).pipe(delay(300));
  }

  if (url.match(/trainer\/payment-plans\/[^/]+$/) && method === 'GET' && !url.includes('/duplicate')) {
    const id = url.split('/').pop();
    const plans = getMockPaymentPlanTemplates();
    const plan = plans.find((p: any) => p.id === id);
    return of(new HttpResponse({
      status: plan ? 200 : 404,
      body: plan || { error: 'Not found' }
    })).pipe(delay(300));
  }

  if (url.includes('/trainer/payment-plans') && method === 'POST' && !url.includes('/assign') && !url.includes('/duplicate')) {
    return of(new HttpResponse({
      status: 201,
      body: { ...(req.body as any), id: 'plan-template-' + Date.now(), trainerId: 'user-1', createdAt: new Date().toISOString() }
    })).pipe(delay(300));
  }

  if (url.match(/trainer\/payment-plans\/[^/]+$/) && method === 'PUT') {
    return of(new HttpResponse({
      status: 200,
      body: { ...(req.body as any), updatedAt: new Date().toISOString() }
    })).pipe(delay(300));
  }

  if (url.match(/trainer\/payment-plans\/[^/]+$/) && method === 'DELETE') {
    return of(new HttpResponse({
      status: 204,
      body: null
    })).pipe(delay(300));
  }

  if (url.includes('/trainer/payment-plans') && url.includes('/duplicate') && method === 'POST') {
    const id = url.split('/')[url.split('/').indexOf('payment-plans') + 1];
    const plans = getMockPaymentPlanTemplates();
    const original = plans.find((p: any) => p.id === id);
    if (original) {
      return of(new HttpResponse({
        status: 201,
        body: { ...original, id: 'plan-template-' + Date.now(), name: original.name + ' (Copia)' }
      })).pipe(delay(300));
    }
  }

  if (url.includes('/trainer/student-plan-assignments') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: getMockStudentPaymentPlanAssignments()
    })).pipe(delay(300));
  }

  if (url.includes('/students') && url.includes('/payment-plan') && method === 'GET') {
    const studentId = url.split('/')[url.split('/').indexOf('students') + 1];
    const assignments = getMockStudentPaymentPlanAssignments();
    const assignment = assignments.find((a: any) => a.studentId === studentId && a.status === 'active');
    return of(new HttpResponse({
      status: 200,
      body: assignment || null
    })).pipe(delay(300));
  }

  if (url.includes('/trainer/payment-plans/assign') && method === 'POST') {
    const body = req.body as any;
    const plan = getMockPaymentPlanTemplates().find((p: any) => p.id === body.planId);
    const student = getMockStudents().find((s: any) => s.id === body.studentId);

    if (plan && student) {
      const basePrice = plan.basePrice;
      let finalPrice = basePrice;

      if (body.surcharges && body.surcharges.length > 0) {
        body.surcharges.forEach((s: any) => {
          finalPrice += (basePrice * s.percentage) / 100;
        });
      }

      const nextPaymentDate = calculateNextPaymentDate(body.startDate, plan.recurrence);

      return of(new HttpResponse({
        status: 201,
        body: {
          id: 'assignment-' + Date.now(),
          studentId: body.studentId,
          studentName: `${student.firstName} ${student.lastName}`,
          planId: body.planId,
          planName: plan.name,
          planType: plan.type,
          basePrice: plan.basePrice,
          surcharges: body.surcharges || [],
          finalPrice: Math.round(finalPrice),
          currency: 'ARS',
          recurrence: plan.recurrence,
          items: body.customItems || plan.items,
          startDate: body.startDate,
          nextPaymentDate,
          status: 'active',
          notes: body.notes || '',
          createdAt: new Date().toISOString()
        }
      })).pipe(delay(300));
    }
    return of(new HttpResponse({ status: 404, body: { error: 'Plan or student not found' } })).pipe(delay(300));
  }

  if (url.includes('/trainer/student-plan-assignments') && url.includes('/status') && method === 'PUT') {
    const body = req.body as any;
    return of(new HttpResponse({
      status: 200,
      body: { ...(req.body as any), updatedAt: new Date().toISOString() }
    })).pipe(delay(300));
  }

  if (url.includes('/trainer/student-plan-assignments') && url.includes('/items') && method === 'PUT') {
    return of(new HttpResponse({
      status: 200,
      body: { ...(req.body as any), updatedAt: new Date().toISOString() }
    })).pipe(delay(300));
  }

  if (url.includes('/payment-plan-items/library') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: getMockPaymentPlanItemsLibrary()
    })).pipe(delay(300));
  }

  if (url.includes('/comments/exercise') && method === 'GET') {
    const exerciseId = new URL('http://dummy' + url).searchParams.get('exerciseId');
    return of(new HttpResponse({
      status: 200,
      body: getMockComments().filter(c => c.exerciseId === exerciseId)
    })).pipe(delay(300));
  }

  if (url.includes('/comments/routine') && method === 'GET') {
    const routineId = new URL('http://dummy' + url).searchParams.get('routineId');
    return of(new HttpResponse({
      status: 200,
      body: getMockComments().filter(c => c.routineId === routineId)
    })).pipe(delay(300));
  }

  if (url.includes('/comments') && url.includes('/reply') && method === 'POST') {
    return of(new HttpResponse({
      status: 201,
      body: { ...(req.body as any), id: 'reply-' + Date.now(), createdAt: new Date().toISOString() }
    })).pipe(delay(300));
  }

  if (url.includes('/student/payment-packs') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: getMockPaymentPacks()
    })).pipe(delay(300));
  }

  if (url.includes('/student/subscription') && method === 'GET') {
    const studentId = 'student-1';
    const subscriptions = getMockSubscriptions();
    const subscription = subscriptions.find(s => s.studentId === studentId && s.status === 'active');
    return of(new HttpResponse({
      status: 200,
      body: subscription || null
    })).pipe(delay(300));
  }

  if (url.includes('/student/subscription') && method === 'PUT') {
    const subscription = getMockSubscriptions().find(s => s.studentId === 'student-1');
    return of(new HttpResponse({
      status: 200,
      body: { ...subscription, ...(req.body as any), updatedAt: new Date().toISOString() }
    })).pipe(delay(300));
  }

  if (url.includes('/student/subscription') && method === 'DELETE') {
    return of(new HttpResponse({
      status: 204,
      body: null
    })).pipe(delay(300));
  }

  if (url.includes('/student/payments') && method === 'GET' && !url.match(/student\/payments\/[^/]+/)) {
    const studentId = 'student-1';
    const allPayments = getMockTrainerPayments();
    let filteredPayments = allPayments.filter(p => p.studentId === studentId);

    const urlObj = new URL('http://dummy' + url);
    const status = urlObj.searchParams.get('status');
    const dateFrom = urlObj.searchParams.get('dateFrom');
    const dateTo = urlObj.searchParams.get('dateTo');

    if (status) {
      filteredPayments = filteredPayments.filter(p => p.status === status);
    }
    if (dateFrom) {
      filteredPayments = filteredPayments.filter(p => new Date(p.paymentDate) >= new Date(dateFrom));
    }
    if (dateTo) {
      filteredPayments = filteredPayments.filter(p => new Date(p.paymentDate) <= new Date(dateTo));
    }

    return of(new HttpResponse({
      status: 200,
      body: filteredPayments
    })).pipe(delay(300));
  }

  if (url.match(/student\/payments\/[^/]+\/receipt$/) && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: new Blob(['Mock PDF Receipt'], { type: 'application/pdf' })
    })).pipe(delay(300));
  }

  if (url.includes('/student/payment-summary') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: getMockStudentPaymentSummary()
    })).pipe(delay(300));
  }

  if (url.includes('/student/payment-methods') && method === 'GET') {
    const studentId = 'student-1';
    const methods = getMockPaymentMethods();
    return of(new HttpResponse({
      status: 200,
      body: methods.filter(m => m.studentId === studentId)
    })).pipe(delay(300));
  }

  if (url.includes('/student/payment-methods') && method === 'POST') {
    return of(new HttpResponse({
      status: 201,
      body: { ...(req.body as any), id: 'pm-' + Date.now(), createdAt: new Date().toISOString() }
    })).pipe(delay(300));
  }

  if (url.match(/student\/payment-methods\/[^/]+$/) && method === 'DELETE') {
    return of(new HttpResponse({
      status: 204,
      body: null
    })).pipe(delay(300));
  }

  if (url.includes('/student/payment-methods') && url.includes('/set-default') && method === 'PUT') {
    return of(new HttpResponse({
      status: 200,
      body: { success: true }
    })).pipe(delay(300));
  }

  if (url.includes('/student/payment-notifications') && method === 'GET') {
    const studentId = 'student-1';
    const notifications = getMockPaymentNotifications();
    return of(new HttpResponse({
      status: 200,
      body: notifications.filter(n => n.studentId === studentId)
    })).pipe(delay(300));
  }

  if (url.includes('/student/payment-notifications') && url.includes('/mark-read') && method === 'PUT') {
    return of(new HttpResponse({
      status: 200,
      body: { success: true }
    })).pipe(delay(300));
  }

  if (url.includes('/student/checkout') && method === 'POST') {
    const success = Math.random() > 0.2;
    return of(new HttpResponse({
      status: 200,
      body: {
        id: 'checkout-' + Date.now(),
        checkoutUrl: 'https://www.mercadopago.com.ar/checkout/mock?preference-id=pref-' + Date.now(),
        status: success ? 'approved' : 'pending'
      }
    })).pipe(delay(1000));
  }

  if (url.includes('/student/calculate-proration') && method === 'POST') {
    const body = req.body as any;
    const amount = Math.floor(Math.random() * 10000) + 5000;
    return of(new HttpResponse({
      status: 200,
      body: {
        amount,
        description: `Diferencia prorrateada entre planes`
      }
    })).pipe(delay(300));
  }

  return next(req);
};

function getMockGyms() {
  return [
    {
      id: 'gym-1',
      name: 'PowerFit Center',
      address: 'Av. Corrientes 1234, Buenos Aires',
      phone: '+54 11 4567-8900',
      email: 'info@powerfit.com',
      logoUrl: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: 'gym-2',
      name: 'Elite Training',
      address: 'Av. Santa Fe 5678, Buenos Aires',
      phone: '+54 11 4567-8901',
      email: 'info@elitetraining.com',
      logoUrl: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=200'
    }
  ];
}

function getMockStudents() {
  return [
    {
      id: 'student-1',
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '+54 11 1234-5678',
      birthDate: '1990-05-15',
      sex: 'M',
      weight: 82.5,
      height: 178,
      photoUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
      medicalNotes: 'Hipertensión controlada',
      gyms: ['gym-1']
    },
    {
      id: 'student-2',
      firstName: 'María',
      lastName: 'González',
      email: 'maria.gonzalez@example.com',
      phone: '+54 11 2345-6789',
      birthDate: '1992-08-20',
      sex: 'F',
      weight: 65,
      height: 165,
      photoUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
      gyms: ['gym-1']
    },
    {
      id: 'student-3',
      firstName: 'Pedro',
      lastName: 'Rodríguez',
      email: 'pedro.rodriguez@example.com',
      phone: '+54 11 3456-7890',
      birthDate: '1988-03-10',
      sex: 'M',
      weight: 90,
      height: 185,
      medicalNotes: 'Lesión de rodilla antigua',
      gyms: ['gym-2']
    },
    {
      id: 'student-4',
      firstName: 'Ana',
      lastName: 'Martínez',
      email: 'ana.martinez@example.com',
      phone: '+54 11 4567-8901',
      birthDate: '1995-11-25',
      sex: 'F',
      weight: 58,
      height: 160,
      photoUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
      gyms: ['gym-1', 'gym-2']
    }
  ];
}

function getMockExercises() {
  return [
    {
      id: 'ex-1',
      name: 'Press de Banca',
      description: 'Ejercicio compuesto para pectorales, tríceps y hombros',
      category: 'Pecho',
      difficulty: 'intermediate',
      muscleGroups: ['Pectorales', 'Tríceps', 'Deltoides anterior'],
      equipment: ['Barra', 'Banco plano'],
      videoUrls: ['https://drive.google.com/file/d/1example/preview'],
      thumbnailUrl: 'https://images.pexels.com/photos/703016/pexels-photo-703016.jpeg?auto=compress&cs=tinysrgb&w=300',
      createdBy: 'trainer-1'
    },
    {
      id: 'ex-2',
      name: 'Sentadilla',
      description: 'Ejercicio fundamental para piernas y glúteos',
      category: 'Piernas',
      difficulty: 'beginner',
      muscleGroups: ['Cuádriceps', 'Glúteos', 'Isquiotibiales'],
      equipment: ['Barra', 'Rack'],
      videoUrls: ['https://drive.google.com/file/d/2example/preview'],
      thumbnailUrl: 'https://images.pexels.com/photos/28080/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300',
      createdBy: 'trainer-1'
    },
    {
      id: 'ex-3',
      name: 'Peso Muerto',
      description: 'Ejercicio de cadena posterior completo',
      category: 'Espalda',
      difficulty: 'advanced',
      muscleGroups: ['Espalda baja', 'Glúteos', 'Isquiotibiales'],
      equipment: ['Barra', 'Discos'],
      videoUrls: ['https://drive.google.com/file/d/3example/preview'],
      thumbnailUrl: 'https://images.pexels.com/photos/2261485/pexels-photo-2261485.jpeg?auto=compress&cs=tinysrgb&w=300',
      createdBy: 'trainer-1'
    },
    {
      id: 'ex-4',
      name: 'Dominadas',
      description: 'Ejercicio para espalda y bíceps',
      category: 'Espalda',
      difficulty: 'intermediate',
      muscleGroups: ['Dorsales', 'Bíceps', 'Trapecio'],
      equipment: ['Barra de dominadas'],
      videoUrls: [],
      thumbnailUrl: 'https://images.pexels.com/photos/1480520/pexels-photo-1480520.jpeg?auto=compress&cs=tinysrgb&w=300',
      createdBy: 'trainer-1'
    },
    {
      id: 'ex-5',
      name: 'Press Militar',
      description: 'Desarrollo de hombros',
      category: 'Hombros',
      difficulty: 'intermediate',
      muscleGroups: ['Deltoides', 'Tríceps'],
      equipment: ['Barra', 'Discos'],
      videoUrls: [],
      thumbnailUrl: 'https://images.pexels.com/photos/3837757/pexels-photo-3837757.jpeg?auto=compress&cs=tinysrgb&w=300',
      createdBy: 'trainer-1'
    },
    {
      id: 'ex-6',
      name: 'Curl de Bíceps',
      description: 'Aislamiento de bíceps',
      category: 'Brazos',
      difficulty: 'beginner',
      muscleGroups: ['Bíceps'],
      equipment: ['Mancuernas'],
      videoUrls: [],
      thumbnailUrl: 'https://images.pexels.com/photos/3757376/pexels-photo-3757376.jpeg?auto=compress&cs=tinysrgb&w=300',
      createdBy: 'trainer-1'
    },
    {
      id: 'ex-7',
      name: 'Extensión de Tríceps',
      description: 'Aislamiento de tríceps',
      category: 'Brazos',
      difficulty: 'beginner',
      muscleGroups: ['Tríceps'],
      equipment: ['Mancuernas'],
      videoUrls: [],
      thumbnailUrl: 'https://images.pexels.com/photos/3490353/pexels-photo-3490353.jpeg?auto=compress&cs=tinysrgb&w=300',
      createdBy: 'trainer-1'
    },
    {
      id: 'ex-8',
      name: 'Abdominales',
      description: 'Ejercicio de core básico',
      category: 'Core',
      difficulty: 'beginner',
      muscleGroups: ['Recto abdominal'],
      equipment: ['Colchoneta'],
      videoUrls: [],
      thumbnailUrl: 'https://images.pexels.com/photos/3775566/pexels-photo-3775566.jpeg?auto=compress&cs=tinysrgb&w=300',
      createdBy: 'trainer-1'
    },
    {
      id: 'ex-9',
      name: 'Plancha',
      description: 'Ejercicio isométrico de core',
      category: 'Core',
      difficulty: 'beginner',
      muscleGroups: ['Core completo'],
      equipment: ['Colchoneta'],
      videoUrls: [],
      thumbnailUrl: 'https://images.pexels.com/photos/3775603/pexels-photo-3775603.jpeg?auto=compress&cs=tinysrgb&w=300',
      createdBy: 'trainer-1'
    },
    {
      id: 'ex-10',
      name: 'Zancadas',
      description: 'Ejercicio unilateral de piernas',
      category: 'Piernas',
      difficulty: 'beginner',
      muscleGroups: ['Cuádriceps', 'Glúteos'],
      equipment: ['Mancuernas'],
      videoUrls: [],
      thumbnailUrl: 'https://images.pexels.com/photos/3766211/pexels-photo-3766211.jpeg?auto=compress&cs=tinysrgb&w=300',
      createdBy: 'trainer-1'
    }
  ];
}

function getMockRoutines() {
  return [
    {
      id: 'routine-1',
      name: 'Rutina Full Body - Principiantes',
      description: 'Rutina de cuerpo completo 3 veces por semana',
      type: 'default',
      gymId: 'gym-1',
      createdBy: 'trainer-1',
      weeklyPlan: [
        {
          day: 1,
          blocks: [
            {
              id: 'block-1',
              name: 'Calentamiento',
              order: 1,
              exercises: [
                {
                  exerciseId: 'ex-9',
                  sets: 3,
                  reps: '30 seg',
                  order: 1
                }
              ]
            },
            {
              id: 'block-2',
              name: 'Tren Superior',
              order: 2,
              exercises: [
                {
                  exerciseId: 'ex-1',
                  sets: 3,
                  reps: '12',
                  rest: '90 seg',
                  order: 1
                },
                {
                  exerciseId: 'ex-4',
                  sets: 3,
                  reps: '8-10',
                  rest: '90 seg',
                  order: 2
                }
              ]
            }
          ]
        },
        {
          day: 3,
          blocks: [
            {
              id: 'block-3',
              name: 'Tren Inferior',
              order: 1,
              exercises: [
                {
                  exerciseId: 'ex-2',
                  sets: 4,
                  reps: '10',
                  rest: '120 seg',
                  order: 1
                },
                {
                  exerciseId: 'ex-10',
                  sets: 3,
                  reps: '12 por pierna',
                  rest: '60 seg',
                  order: 2
                }
              ]
            }
          ]
        },
        {
          day: 5,
          blocks: [
            {
              id: 'block-4',
              name: 'Full Body',
              order: 1,
              exercises: [
                {
                  exerciseId: 'ex-3',
                  sets: 3,
                  reps: '8',
                  rest: '120 seg',
                  order: 1
                },
                {
                  exerciseId: 'ex-5',
                  sets: 3,
                  reps: '10',
                  rest: '90 seg',
                  order: 2
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'routine-2',
      name: 'Rutina Push/Pull/Legs',
      description: 'Rutina avanzada 6 días por semana',
      type: 'default',
      gymId: 'gym-1',
      createdBy: 'trainer-1',
      weeklyPlan: [
        {
          day: 1,
          blocks: [
            {
              id: 'block-5',
              name: 'Push - Pecho y Hombros',
              order: 1,
              exercises: [
                {
                  exerciseId: 'ex-1',
                  sets: 4,
                  reps: '8-10',
                  rest: '120 seg',
                  order: 1
                },
                {
                  exerciseId: 'ex-5',
                  sets: 4,
                  reps: '10',
                  rest: '90 seg',
                  order: 2
                }
              ]
            }
          ]
        },
        {
          day: 2,
          blocks: [
            {
              id: 'block-6',
              name: 'Pull - Espalda',
              order: 1,
              exercises: [
                {
                  exerciseId: 'ex-3',
                  sets: 4,
                  reps: '6-8',
                  rest: '120 seg',
                  order: 1
                },
                {
                  exerciseId: 'ex-4',
                  sets: 4,
                  reps: '8-12',
                  rest: '90 seg',
                  order: 2
                }
              ]
            }
          ]
        },
        {
          day: 3,
          blocks: [
            {
              id: 'block-7',
              name: 'Legs - Piernas',
              order: 1,
              exercises: [
                {
                  exerciseId: 'ex-2',
                  sets: 4,
                  reps: '8-10',
                  rest: '120 seg',
                  order: 1
                },
                {
                  exerciseId: 'ex-10',
                  sets: 3,
                  reps: '12 por pierna',
                  rest: '60 seg',
                  order: 2
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'routine-3',
      name: 'Rutina Personalizada - Juan Pérez',
      description: 'Enfoque en hipertrofia',
      type: 'personalized',
      gymId: 'gym-1',
      createdBy: 'trainer-1',
      assignedTo: ['student-1'],
      weeklyPlan: [
        {
          day: 1,
          blocks: [
            {
              id: 'block-8',
              name: 'Pecho',
              order: 1,
              exercises: [
                {
                  exerciseId: 'ex-1',
                  sets: 4,
                  reps: '10-12',
                  weight: '60kg',
                  rest: '90 seg',
                  notes: 'Controlar el descenso',
                  order: 1
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'routine-4',
      name: 'Rutina Personalizada - María González',
      description: 'Tonificación general',
      type: 'personalized',
      gymId: 'gym-1',
      createdBy: 'trainer-1',
      assignedTo: ['student-2'],
      weeklyPlan: [
        {
          day: 2,
          blocks: [
            {
              id: 'block-9',
              name: 'Tren Inferior',
              order: 1,
              exercises: [
                {
                  exerciseId: 'ex-2',
                  sets: 3,
                  reps: '15',
                  weight: '30kg',
                  rest: '60 seg',
                  order: 1
                },
                {
                  exerciseId: 'ex-10',
                  sets: 3,
                  reps: '12 por pierna',
                  rest: '60 seg',
                  order: 2
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}

function getMockBlocks() {
  return [
    {
      id: 'block-preset-1',
      name: 'Calentamiento General',
      description: 'Rutina de calentamiento estándar',
      type: 'preset',
      exercises: [
        { exerciseId: 'ex-9', sets: 3, reps: '30 seg', order: 1 },
        { exerciseId: 'ex-8', sets: 2, reps: '15', order: 2 }
      ],
      createdBy: 'trainer-1',
      createdAt: '2025-01-15T10:00:00Z'
    },
    {
      id: 'block-preset-2',
      name: 'Fuerza Tren Superior',
      description: 'Bloque enfocado en desarrollo de pecho y brazos',
      type: 'preset',
      exercises: [
        { exerciseId: 'ex-1', sets: 4, reps: '10-12', rest: '90 seg', order: 1 },
        { exerciseId: 'ex-6', sets: 3, reps: '12', rest: '60 seg', order: 2 },
        { exerciseId: 'ex-7', sets: 3, reps: '12', rest: '60 seg', order: 3 }
      ],
      createdBy: 'trainer-1',
      createdAt: '2025-01-15T10:00:00Z'
    },
    {
      id: 'block-preset-3',
      name: 'Piernas Completo',
      description: 'Entrenamiento completo de tren inferior',
      type: 'preset',
      exercises: [
        { exerciseId: 'ex-2', sets: 4, reps: '8-10', rest: '120 seg', order: 1 },
        { exerciseId: 'ex-3', sets: 3, reps: '8', rest: '120 seg', order: 2 },
        { exerciseId: 'ex-10', sets: 3, reps: '12 por pierna', rest: '60 seg', order: 3 }
      ],
      createdBy: 'trainer-1',
      createdAt: '2025-01-15T10:00:00Z'
    }
  ];
}

function getMockComments() {
  return [
    {
      id: 'comment-1',
      exerciseId: 'ex-1',
      studentId: 'student-1',
      routineId: 'routine-3',
      comment: 'Me costó mucho la última serie, creo que necesito bajar el peso',
      completed: true,
      createdAt: '2025-10-14T18:30:00Z',
      replies: [
        {
          id: 'reply-1',
          userId: 'trainer-1',
          userName: 'Carlos Trainer',
          comment: 'Perfecto Juan, bajá 5kg y enfocate en la técnica.',
          createdAt: '2025-10-14T19:00:00Z'
        }
      ]
    },
    {
      id: 'comment-2',
      exerciseId: 'ex-2',
      studentId: 'student-2',
      routineId: 'routine-4',
      comment: '¡Logré completar todas las series! Me siento muy bien',
      completed: true,
      createdAt: '2025-10-14T17:00:00Z',
      replies: [
        {
          id: 'reply-2',
          userId: 'trainer-1',
          userName: 'Carlos Trainer',
          comment: 'Excelente María! La próxima semana aumentamos la intensidad.',
          createdAt: '2025-10-14T20:00:00Z'
        }
      ]
    }
  ];
}

function getMockPaymentPacks() {
  return [
    {
      id: 'pack-1',
      name: 'Pack Básico',
      description: 'Acceso al gimnasio + rutina personalizada',
      price: 15000,
      currency: 'ARS',
      duration: 30,
      features: ['Acceso ilimitado al gimnasio', 'Rutina personalizada', 'Seguimiento mensual', 'Soporte vía email']
    },
    {
      id: 'pack-2',
      name: 'Pack Premium',
      description: 'Todo incluido + clases grupales',
      price: 25000,
      currency: 'ARS',
      duration: 30,
      features: ['Todo lo del Pack Básico', 'Clases grupales ilimitadas', 'Análisis corporal mensual', 'Consultas nutricionales']
    },
    {
      id: 'pack-3',
      name: 'Pack Elite',
      description: 'Entrenamiento personalizado 1 a 1',
      price: 45000,
      currency: 'ARS',
      duration: 30,
      features: ['Todo lo del Pack Premium', 'Sesiones personalizadas 3x semana', 'Plan nutricional completo', 'Videos de feedback semanales']
    }
  ];
}

function getMockPaymentHistory() {
  return [
    {
      id: 'payment-1',
      studentId: 'student-1',
      packId: 'pack-2',
      packName: 'Pack Premium',
      amount: 25000,
      currency: 'ARS',
      status: 'approved',
      externalId: 'MP-12345678',
      createdAt: '2025-09-15T10:00:00Z'
    },
    {
      id: 'payment-2',
      studentId: 'student-1',
      packId: 'pack-2',
      packName: 'Pack Premium',
      amount: 25000,
      currency: 'ARS',
      status: 'pending',
      externalId: 'MP-12345680',
      createdAt: '2025-10-15T08:00:00Z'
    }
  ];
}

function getMockMetrics() {
  return {
    activeStudents: 34,
    totalRoutines: 12,
    totalExercises: 87,
    monthlyRevenue: 485000,
    activeSubscriptions: 28,
    studentGrowth: [
      { month: 'Mayo', count: 22 },
      { month: 'Junio', count: 26 },
      { month: 'Julio', count: 29 },
      { month: 'Agosto', count: 31 },
      { month: 'Septiembre', count: 33 },
      { month: 'Octubre', count: 34 }
    ],
    revenueByMonth: [
      { month: 'Mayo', amount: 330000 },
      { month: 'Junio', amount: 390000 },
      { month: 'Julio', amount: 435000 },
      { month: 'Agosto', amount: 465000 },
      { month: 'Septiembre', amount: 495000 },
      { month: 'Octubre', amount: 485000 }
    ],
    topExercises: [
      { name: 'Sentadilla', usage: 145 },
      { name: 'Press de Banca', usage: 132 },
      { name: 'Peso Muerto', usage: 98 },
      { name: 'Dominadas', usage: 87 },
      { name: 'Press Militar', usage: 76 }
    ],
    subscriptionsByPack: [
      { pack: 'Básico', count: 12 },
      { pack: 'Premium', count: 14 },
      { pack: 'Elite', count: 2 }
    ],
    completionRate: 78,
    averageSessionsPerWeek: 3.5
  };
}

function getMockTrainerPayments() {
  return [
    {
      id: 'payment-1',
      studentId: 'student-1',
      studentName: 'Juan Pérez',
      trainerId: 'user-1',
      packId: 'pack-2',
      packName: 'Pack Premium',
      amount: 25000,
      currency: 'ARS',
      paymentDate: '2025-09-15',
      paymentMethod: 'mercadopago',
      status: 'approved',
      description: 'Pago mensual septiembre'
    },
    {
      id: 'payment-2',
      studentId: 'student-2',
      studentName: 'María González',
      trainerId: 'user-1',
      packId: 'pack-1',
      packName: 'Pack Básico',
      amount: 15000,
      currency: 'ARS',
      paymentDate: '2025-09-20',
      paymentMethod: 'transfer',
      status: 'approved',
      description: 'Pago mensual septiembre'
    },
    {
      id: 'payment-3',
      studentId: 'student-1',
      studentName: 'Juan Pérez',
      trainerId: 'user-1',
      packId: 'pack-2',
      packName: 'Pack Premium',
      amount: 25000,
      currency: 'ARS',
      paymentDate: '2025-10-15',
      paymentMethod: 'mercadopago',
      status: 'pending',
      description: 'Pago mensual octubre'
    },
    {
      id: 'payment-4',
      studentId: 'student-3',
      studentName: 'Pedro Rodríguez',
      trainerId: 'user-1',
      packId: 'pack-1',
      packName: 'Pack Básico',
      amount: 15000,
      currency: 'ARS',
      paymentDate: '2025-10-01',
      paymentMethod: 'cash',
      status: 'approved',
      description: 'Pago en efectivo octubre'
    },
    {
      id: 'payment-5',
      studentId: 'student-4',
      studentName: 'Ana Martínez',
      trainerId: 'user-1',
      packId: 'pack-3',
      packName: 'Pack Elite',
      amount: 45000,
      currency: 'ARS',
      paymentDate: '2025-10-05',
      paymentMethod: 'card',
      status: 'approved',
      description: 'Pago mensual octubre'
    },
    {
      id: 'payment-6',
      studentId: 'student-2',
      studentName: 'María González',
      trainerId: 'user-1',
      packId: 'pack-1',
      packName: 'Pack Básico',
      amount: 15000,
      currency: 'ARS',
      paymentDate: '2025-10-20',
      paymentMethod: 'transfer',
      status: 'pending',
      description: 'Pago mensual octubre'
    },
    {
      id: 'payment-7',
      studentId: 'student-1',
      studentName: 'Juan Pérez',
      trainerId: 'user-1',
      packId: null,
      packName: 'Clase particular',
      amount: 8000,
      currency: 'ARS',
      paymentDate: '2025-10-12',
      paymentMethod: 'cash',
      status: 'approved',
      description: 'Sesión individual de entrenamiento'
    },
    {
      id: 'payment-8',
      studentId: 'student-3',
      studentName: 'Pedro Rodríguez',
      trainerId: 'user-1',
      packId: null,
      packName: 'Evaluación física',
      amount: 5000,
      currency: 'ARS',
      paymentDate: '2025-09-28',
      paymentMethod: 'transfer',
      status: 'approved',
      description: 'Evaluación inicial y mediciones'
    },
    {
      id: 'payment-9',
      studentId: 'student-4',
      studentName: 'Ana Martínez',
      trainerId: 'user-1',
      packId: 'pack-3',
      packName: 'Pack Elite',
      amount: 45000,
      currency: 'ARS',
      paymentDate: '2025-09-05',
      paymentMethod: 'card',
      status: 'approved',
      description: 'Pago mensual septiembre'
    },
    {
      id: 'payment-10',
      studentId: 'student-2',
      studentName: 'María González',
      trainerId: 'user-1',
      packId: 'pack-2',
      packName: 'Pack Premium',
      amount: 25000,
      currency: 'ARS',
      paymentDate: '2025-08-20',
      paymentMethod: 'mercadopago',
      status: 'approved',
      description: 'Pago mensual agosto'
    },
    {
      id: 'payment-11',
      studentId: 'student-1',
      studentName: 'Juan Pérez',
      trainerId: 'user-1',
      packId: 'pack-2',
      packName: 'Pack Premium',
      amount: 25000,
      currency: 'ARS',
      paymentDate: '2025-08-15',
      paymentMethod: 'transfer',
      status: 'approved',
      description: 'Pago mensual agosto'
    },
    {
      id: 'payment-12',
      studentId: 'student-3',
      studentName: 'Pedro Rodríguez',
      trainerId: 'user-1',
      packId: 'pack-1',
      packName: 'Pack Básico',
      amount: 15000,
      currency: 'ARS',
      paymentDate: '2025-09-01',
      paymentMethod: 'cash',
      status: 'approved',
      description: 'Pago mensual septiembre'
    },
    {
      id: 'payment-13',
      studentId: 'student-4',
      studentName: 'Ana Martínez',
      trainerId: 'user-1',
      packId: null,
      packName: 'Plan nutricional',
      amount: 12000,
      currency: 'ARS',
      paymentDate: '2025-10-18',
      paymentMethod: 'mercadopago',
      status: 'approved',
      description: 'Plan alimenticio personalizado'
    },
    {
      id: 'payment-14',
      studentId: 'student-2',
      studentName: 'María González',
      trainerId: 'user-1',
      packId: 'pack-1',
      packName: 'Pack Básico',
      amount: 15000,
      currency: 'ARS',
      paymentDate: '2025-08-20',
      paymentMethod: 'transfer',
      status: 'approved',
      description: 'Pago mensual agosto'
    },
    {
      id: 'payment-15',
      studentId: 'student-3',
      studentName: 'Pedro Rodríguez',
      trainerId: 'user-1',
      packId: 'pack-1',
      packName: 'Pack Básico',
      amount: 15000,
      currency: 'ARS',
      paymentDate: '2025-08-01',
      paymentMethod: 'cash',
      status: 'approved',
      description: 'Pago mensual agosto'
    }
  ];
}

function getMockSubscriptions() {
  return [
    {
      id: 'sub-1',
      studentId: 'student-1',
      packId: 'pack-2',
      packName: 'Pack Premium',
      status: 'active',
      startDate: '2025-08-15',
      nextPaymentDate: '2025-11-15',
      autoRenew: true,
      price: 25000,
      currency: 'ARS'
    },
    {
      id: 'sub-2',
      studentId: 'student-2',
      packId: 'pack-1',
      packName: 'Pack Básico',
      status: 'active',
      startDate: '2025-08-20',
      nextPaymentDate: '2025-11-20',
      autoRenew: true,
      price: 15000,
      currency: 'ARS'
    },
    {
      id: 'sub-3',
      studentId: 'student-3',
      packId: 'pack-1',
      packName: 'Pack Básico',
      status: 'active',
      startDate: '2025-08-01',
      nextPaymentDate: '2025-11-01',
      autoRenew: false,
      price: 15000,
      currency: 'ARS'
    },
    {
      id: 'sub-4',
      studentId: 'student-4',
      packId: 'pack-3',
      packName: 'Pack Elite',
      status: 'active',
      startDate: '2025-09-05',
      nextPaymentDate: '2025-11-05',
      autoRenew: true,
      price: 45000,
      currency: 'ARS'
    }
  ];
}

function getMockPaymentMethods() {
  return [
    {
      id: 'pm-1',
      studentId: 'student-1',
      type: 'card',
      label: 'Tarjeta **** 4242',
      lastFourDigits: '4242',
      cardBrand: 'Visa',
      expiryMonth: '12',
      expiryYear: '2026',
      isDefault: true,
      createdAt: '2025-08-15T10:00:00Z'
    },
    {
      id: 'pm-2',
      studentId: 'student-2',
      type: 'transfer',
      label: 'Transferencia Bancaria',
      bankName: 'Banco Nación',
      accountNumber: '****5678',
      isDefault: true,
      createdAt: '2025-08-20T10:00:00Z'
    },
    {
      id: 'pm-3',
      studentId: 'student-4',
      type: 'card',
      label: 'Tarjeta **** 9876',
      lastFourDigits: '9876',
      cardBrand: 'Mastercard',
      expiryMonth: '08',
      expiryYear: '2027',
      isDefault: true,
      createdAt: '2025-09-05T10:00:00Z'
    }
  ];
}

function getMockPaymentNotifications() {
  return [
    {
      id: 'notif-1',
      studentId: 'student-1',
      type: 'payment_reminder',
      title: 'Próximo pago programado',
      message: 'Tu próximo pago de $25,000 vence el 15 de noviembre',
      dueDate: '2025-11-15',
      isRead: false,
      createdAt: '2025-10-22T08:00:00Z',
      priority: 'medium'
    },
    {
      id: 'notif-2',
      studentId: 'student-2',
      type: 'payment_reminder',
      title: 'Próximo pago programado',
      message: 'Tu próximo pago de $15,000 vence el 20 de noviembre',
      dueDate: '2025-11-20',
      isRead: false,
      createdAt: '2025-10-22T08:00:00Z',
      priority: 'medium'
    },
    {
      id: 'notif-3',
      studentId: 'student-1',
      type: 'payment_confirmed',
      title: 'Pago confirmado',
      message: 'Tu pago de $25,000 fue procesado exitosamente',
      isRead: true,
      createdAt: '2025-10-15T10:05:00Z',
      priority: 'low'
    },
    {
      id: 'notif-4',
      studentId: 'student-3',
      type: 'payment_reminder',
      title: 'Pago próximo a vencer',
      message: 'Tu próximo pago de $15,000 vence el 1 de noviembre. No olvides renovar tu suscripción manual',
      dueDate: '2025-11-01',
      isRead: false,
      createdAt: '2025-10-25T08:00:00Z',
      priority: 'high'
    }
  ];
}

function getMockStudentPaymentSummary() {
  const payments = getMockTrainerPayments().filter(p => p.studentId === 'student-1');
  const approvedPayments = payments.filter(p => p.status === 'approved');
  const pendingPayments = payments.filter(p => p.status === 'pending');

  const totalSpent = approvedPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  const subscription = getMockSubscriptions().find(s => s.studentId === 'student-1' && s.status === 'active');

  return {
    currentBalance: 0,
    nextPaymentAmount: subscription?.price || 0,
    nextPaymentDate: subscription?.nextPaymentDate || '',
    totalSpent,
    totalPayments: approvedPayments.length,
    pendingAmount,
    accountStatus: pendingAmount > 0 ? 'pending' : 'up_to_date',
    activeSince: subscription?.startDate || '2025-08-15'
  };
}

function getMockPaymentPlanTemplates() {
  return JSON.parse(`[
    {
      "id": "plan-template-1",
      "trainerId": "user-1",
      "name": "Plan Mensual Básico",
      "description": "Plan ideal para comenzar tu entrenamiento con acceso completo al gimnasio",
      "type": "general",
      "basePrice": 15000,
      "currency": "ARS",
      "recurrence": "mensual",
      "durationDays": 30,
      "isActive": true,
      "items": [
        { "id": "item-1", "description": "Acceso ilimitado al gimnasio", "included": true, "category": "acceso", "order": 1 },
        { "id": "item-2", "description": "Rutina personalizada", "included": true, "category": "seguimiento", "order": 2 },
        { "id": "item-3", "description": "Seguimiento mensual", "included": true, "category": "seguimiento", "order": 3 },
        { "id": "item-4", "description": "Soporte vía email", "included": true, "category": "extras", "order": 4 }
      ],
      "createdAt": "2025-01-15T10:00:00Z"
    },
    {
      "id": "plan-template-2",
      "trainerId": "user-1",
      "name": "Plan Premium",
      "description": "Todo incluido con clases grupales y seguimiento nutricional",
      "type": "general",
      "basePrice": 25000,
      "currency": "ARS",
      "recurrence": "mensual",
      "durationDays": 30,
      "isActive": true,
      "items": [
        { "id": "item-5", "description": "Acceso ilimitado al gimnasio", "included": true, "category": "acceso", "order": 1 },
        { "id": "item-6", "description": "Rutina personalizada avanzada", "included": true, "category": "seguimiento", "order": 2 },
        { "id": "item-7", "description": "Clases grupales ilimitadas", "included": true, "category": "clases", "order": 3 },
        { "id": "item-8", "description": "Análisis de composición corporal mensual", "included": true, "category": "seguimiento", "order": 4 },
        { "id": "item-9", "description": "Consultas nutricionales", "included": true, "category": "nutricion", "order": 5 },
        { "id": "item-10", "description": "Seguimiento semanal de progreso", "included": true, "category": "seguimiento", "order": 6 },
        { "id": "item-11", "description": "Soporte prioritario", "included": true, "category": "extras", "order": 7 }
      ],
      "createdAt": "2025-01-15T10:30:00Z"
    },
    {
      "id": "plan-template-3",
      "trainerId": "user-1",
      "name": "Plan Elite",
      "description": "Entrenamiento personalizado 1 a 1 con seguimiento integral",
      "type": "general",
      "basePrice": 45000,
      "currency": "ARS",
      "recurrence": "mensual",
      "durationDays": 30,
      "isActive": true,
      "items": [
        { "id": "item-12", "description": "Acceso ilimitado premium", "included": true, "category": "acceso", "order": 1 },
        { "id": "item-13", "description": "Sesiones personalizadas 3x semana", "included": true, "category": "clases", "order": 2 },
        { "id": "item-14", "description": "Plan nutricional completo", "included": true, "category": "nutricion", "order": 3 },
        { "id": "item-15", "description": "Videos de feedback semanales", "included": true, "category": "seguimiento", "order": 4 },
        { "id": "item-16", "description": "Análisis corporal quincenal", "included": true, "category": "seguimiento", "order": 5 },
        { "id": "item-17", "description": "Acceso a material exclusivo", "included": true, "category": "extras", "order": 6 },
        { "id": "item-18", "description": "Soporte 24/7", "included": true, "category": "extras", "order": 7 }
      ],
      "createdAt": "2025-01-15T11:00:00Z"
    }
  ]`);
}

function getMockStudentPaymentPlanAssignments() {
  return JSON.parse(`[
    {
      "id": "assignment-1",
      "studentId": "student-1",
      "studentName": "Juan Pérez",
      "planId": "plan-template-2",
      "planName": "Plan Premium",
      "planType": "general",
      "basePrice": 25000,
      "surcharges": [],
      "finalPrice": 25000,
      "currency": "ARS",
      "recurrence": "mensual",
      "items": [
        { "id": "item-5", "description": "Acceso ilimitado al gimnasio", "included": true, "category": "acceso", "order": 1 },
        { "id": "item-6", "description": "Rutina personalizada avanzada", "included": true, "category": "seguimiento", "order": 2 },
        { "id": "item-7", "description": "Clases grupales ilimitadas", "included": true, "category": "clases", "order": 3 },
        { "id": "item-8", "description": "Análisis de composición corporal mensual", "included": true, "category": "seguimiento", "order": 4 },
        { "id": "item-9", "description": "Consultas nutricionales", "included": true, "category": "nutricion", "order": 5 },
        { "id": "item-10", "description": "Seguimiento semanal de progreso", "included": true, "category": "seguimiento", "order": 6 },
        { "id": "item-11", "description": "Soporte prioritario", "included": true, "category": "extras", "order": 7 }
      ],
      "startDate": "2025-08-15",
      "nextPaymentDate": "2025-11-15",
      "status": "active",
      "createdAt": "2025-08-15T10:00:00Z"
    },
    {
      "id": "assignment-2",
      "studentId": "student-2",
      "studentName": "María González",
      "planId": "plan-template-1",
      "planName": "Plan Mensual Básico",
      "planType": "general",
      "basePrice": 15000,
      "surcharges": [],
      "finalPrice": 15000,
      "currency": "ARS",
      "recurrence": "mensual",
      "items": [
        { "id": "item-1", "description": "Acceso ilimitado al gimnasio", "included": true, "category": "acceso", "order": 1 },
        { "id": "item-2", "description": "Rutina personalizada", "included": true, "category": "seguimiento", "order": 2 },
        { "id": "item-3", "description": "Seguimiento mensual", "included": true, "category": "seguimiento", "order": 3 },
        { "id": "item-4", "description": "Soporte vía email", "included": true, "category": "extras", "order": 4 }
      ],
      "startDate": "2025-08-20",
      "nextPaymentDate": "2025-11-20",
      "status": "active",
      "createdAt": "2025-08-20T14:30:00Z"
    }
  ]`);
}

function getMockPaymentPlanItemsLibrary() {
  return JSON.parse(`[
    {
      "category": "acceso",
      "items": ["Acceso ilimitado al gimnasio", "Acceso en horarios específicos", "Acceso a instalaciones premium", "Acceso a zona de cardio", "Acceso a zona de pesas"]
    },
    {
      "category": "clases",
      "items": ["Clases grupales ilimitadas", "2 clases grupales por semana", "4 clases grupales por semana", "Sesiones personalizadas 1x semana", "Sesiones personalizadas 2x semana", "Sesiones personalizadas 3x semana"]
    },
    {
      "category": "seguimiento",
      "items": ["Rutina personalizada", "Rutina personalizada avanzada", "Actualización de rutina mensual", "Seguimiento mensual", "Seguimiento semanal", "Videos de feedback semanales", "Análisis de composición corporal mensual"]
    },
    {
      "category": "nutricion",
      "items": ["Plan nutricional básico", "Plan nutricional completo", "Consultas nutricionales mensuales", "Seguimiento alimenticio"]
    },
    {
      "category": "extras",
      "items": ["Soporte vía email", "Soporte vía WhatsApp", "Soporte prioritario", "Soporte 24/7", "Acceso a material exclusivo"]
    }
  ]`);
}

function calculateNextPaymentDate(startDate: string, recurrence: string): string {
  const date = new Date(startDate);

  switch (recurrence) {
    case 'mensual':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'bimestral':
      date.setMonth(date.getMonth() + 2);
      break;
    case 'trimestral':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'semestral':
      date.setMonth(date.getMonth() + 6);
      break;
    case 'anual':
      date.setFullYear(date.getFullYear() + 1);
      break;
    case 'unico':
      date.setFullYear(date.getFullYear() + 10);
      break;
  }

  return date.toISOString().split('T')[0];
}
