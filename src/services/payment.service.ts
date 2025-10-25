import { apiClient, ApiResponse } from '../lib/api';
import { Payment, PaymentStatus, Subscription, SubscriptionPlan, PaginatedResponse } from '../lib/types';

export interface PaymentFilters {
  status?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  patientId?: string;
  subscriptionId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreatePaymentData {
  amount: number;
  currency?: string;
  description?: string;
  patientId?: string;
  appointmentId?: string;
  dueDate?: string;
  method: 'cash' | 'card' | 'pix' | 'transfer' | 'other';
}

export interface PaymentStats {
  totalRevenue: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  averageTicket: number;
  totalTransactions: number;
  byMonth: Array<{
    month: string;
    revenue: number;
    transactions: number;
  }>;
  byMethod: Array<{
    method: string;
    amount: number;
    count: number;
  }>;
}

export interface StripePaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

class PaymentService {
  async getPayments(filters: PaymentFilters = {}): Promise<ApiResponse<PaginatedResponse<Payment>>> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const queryString = params.toString();
      return await apiClient.get<PaginatedResponse<Payment>>(
        `/payments${queryString ? `?${queryString}` : ''}`
      );
    } catch (error) {
      console.error('Get payments error:', error);
      throw error;
    }
  }

  async getPaymentById(id: string): Promise<ApiResponse<Payment>> {
    try {
      return await apiClient.get<Payment>(`/payments/${id}`);
    } catch (error) {
      console.error('Get payment by ID error:', error);
      throw error;
    }
  }

  async createPayment(data: CreatePaymentData): Promise<ApiResponse<Payment>> {
    try {
      return await apiClient.post<Payment>('/payments', data);
    } catch (error) {
      console.error('Create payment error:', error);
      throw error;
    }
  }

  async updatePayment(id: string, data: Partial<CreatePaymentData>): Promise<ApiResponse<Payment>> {
    try {
      return await apiClient.put<Payment>(`/payments/${id}`, data);
    } catch (error) {
      console.error('Update payment error:', error);
      throw error;
    }
  }

  async deletePayment(id: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.delete<void>(`/payments/${id}`);
    } catch (error) {
      console.error('Delete payment error:', error);
      throw error;
    }
  }

  async updatePaymentStatus(id: string, status: PaymentStatus): Promise<ApiResponse<Payment>> {
    try {
      return await apiClient.patch<Payment>(`/payments/${id}/status`, { status });
    } catch (error) {
      console.error('Update payment status error:', error);
      throw error;
    }
  }

  async processPayment(id: string, method: string, details?: any): Promise<ApiResponse<Payment>> {
    try {
      return await apiClient.post<Payment>(`/payments/${id}/process`, {
        method,
        details
      });
    } catch (error) {
      console.error('Process payment error:', error);
      throw error;
    }
  }

  async refundPayment(id: string, amount?: number, reason?: string): Promise<ApiResponse<Payment>> {
    try {
      return await apiClient.post<Payment>(`/payments/${id}/refund`, {
        amount,
        reason
      });
    } catch (error) {
      console.error('Refund payment error:', error);
      throw error;
    }
  }

  async getPaymentStats(startDate?: string, endDate?: string): Promise<ApiResponse<PaymentStats>> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const queryString = params.toString();
      return await apiClient.get<PaymentStats>(
        `/payments/stats${queryString ? `?${queryString}` : ''}`
      );
    } catch (error) {
      console.error('Get payment stats error:', error);
      throw error;
    }
  }

  async getPendingPayments(): Promise<ApiResponse<Payment[]>> {
    try {
      return await apiClient.get<Payment[]>('/payments/pending');
    } catch (error) {
      console.error('Get pending payments error:', error);
      throw error;
    }
  }

  async getOverduePayments(): Promise<ApiResponse<Payment[]>> {
    try {
      return await apiClient.get<Payment[]>('/payments/overdue');
    } catch (error) {
      console.error('Get overdue payments error:', error);
      throw error;
    }
  }

  async getPatientPayments(patientId: string): Promise<ApiResponse<Payment[]>> {
    try {
      return await apiClient.get<Payment[]>(`/patients/${patientId}/payments`);
    } catch (error) {
      console.error('Get patient payments error:', error);
      throw error;
    }
  }

  // Stripe Integration
  async createStripePaymentIntent(amount: number, currency: string = 'brl'): Promise<ApiResponse<StripePaymentIntent>> {
    try {
      return await apiClient.post<StripePaymentIntent>('/payments/stripe/payment-intent', {
        amount,
        currency
      });
    } catch (error) {
      console.error('Create Stripe payment intent error:', error);
      throw error;
    }
  }

  async confirmStripePayment(paymentIntentId: string): Promise<ApiResponse<Payment>> {
    try {
      return await apiClient.post<Payment>('/payments/stripe/confirm', {
        paymentIntentId
      });
    } catch (error) {
      console.error('Confirm Stripe payment error:', error);
      throw error;
    }
  }

  // PIX Integration (Brazilian instant payment)
  async createPixPayment(amount: number, description: string): Promise<ApiResponse<{
    qrCode: string;
    pixKey: string;
    expiresAt: string;
    paymentId: string;
  }>> {
    try {
      return await apiClient.post('/payments/pix/create', {
        amount,
        description
      });
    } catch (error) {
      console.error('Create PIX payment error:', error);
      throw error;
    }
  }

  async checkPixPaymentStatus(paymentId: string): Promise<ApiResponse<{
    status: 'pending' | 'paid' | 'expired';
    paidAt?: string;
  }>> {
    try {
      return await apiClient.get(`/payments/pix/${paymentId}/status`);
    } catch (error) {
      console.error('Check PIX payment status error:', error);
      throw error;
    }
  }

  // Subscription Management
  async getSubscription(): Promise<ApiResponse<Subscription>> {
    try {
      return await apiClient.get<Subscription>('/subscription');
    } catch (error) {
      console.error('Get subscription error:', error);
      throw error;
    }
  }

  async updateSubscription(plan: SubscriptionPlan): Promise<ApiResponse<Subscription>> {
    try {
      return await apiClient.put<Subscription>('/subscription', { plan });
    } catch (error) {
      console.error('Update subscription error:', error);
      throw error;
    }
  }

  async cancelSubscription(reason?: string): Promise<ApiResponse<Subscription>> {
    try {
      return await apiClient.post<Subscription>('/subscription/cancel', { reason });
    } catch (error) {
      console.error('Cancel subscription error:', error);
      throw error;
    }
  }

  async reactivateSubscription(): Promise<ApiResponse<Subscription>> {
    try {
      return await apiClient.post<Subscription>('/subscription/reactivate');
    } catch (error) {
      console.error('Reactivate subscription error:', error);
      throw error;
    }
  }

  async getSubscriptionUsage(): Promise<ApiResponse<{
    plan: SubscriptionPlan;
    limits: {
      patients: number;
      appointments: number;
      storage: number;
      users: number;
    };
    current: {
      patients: number;
      appointments: number;
      storage: number;
      users: number;
    };
    percentage: {
      patients: number;
      appointments: number;
      storage: number;
      users: number;
    };
  }>> {
    try {
      return await apiClient.get('/subscription/usage');
    } catch (error) {
      console.error('Get subscription usage error:', error);
      throw error;
    }
  }

  async getAvailablePlans(): Promise<ApiResponse<Array<{
    id: string;
    name: SubscriptionPlan;
    price: number;
    currency: string;
    interval: 'month' | 'year';
    features: {
      patients: number | 'unlimited';
      appointments: number | 'unlimited';
      storage: number; // in GB
      users: number;
      support: boolean;
      customReports: boolean;
      api: boolean;
    };
  }>>> {
    try {
      return await apiClient.get('/subscription/plans');
    } catch (error) {
      console.error('Get available plans error:', error);
      throw error;
    }
  }

  // Invoice Management
  async generateInvoice(paymentId: string): Promise<ApiResponse<{ url: string }>> {
    try {
      return await apiClient.post<{ url: string }>(`/payments/${paymentId}/invoice`);
    } catch (error) {
      console.error('Generate invoice error:', error);
      throw error;
    }
  }

  async sendInvoice(paymentId: string, email: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.post<void>(`/payments/${paymentId}/send-invoice`, { email });
    } catch (error) {
      console.error('Send invoice error:', error);
      throw error;
    }
  }

  async getInvoices(filters?: {
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<ApiResponse<Array<{
    id: string;
    paymentId: string;
    number: string;
    amount: number;
    status: string;
    dueDate: string;
    paidAt?: string;
    url: string;
  }>>> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }

      const queryString = params.toString();
      return await apiClient.get(
        `/payments/invoices${queryString ? `?${queryString}` : ''}`
      );
    } catch (error) {
      console.error('Get invoices error:', error);
      throw error;
    }
  }

  // Reports
  async getRevenueReport(
    startDate: string,
    endDate: string,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Promise<ApiResponse<Array<{
    period: string;
    revenue: number;
    transactions: number;
    averageTicket: number;
  }>>> {
    try {
      return await apiClient.get(
        `/payments/reports/revenue?startDate=${startDate}&endDate=${endDate}&groupBy=${groupBy}`
      );
    } catch (error) {
      console.error('Get revenue report error:', error);
      throw error;
    }
  }

  async exportPayments(filters?: PaymentFilters): Promise<ApiResponse<{ url: string }>> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const queryString = params.toString();
      return await apiClient.get<{ url: string }>(
        `/payments/export${queryString ? `?${queryString}` : ''}`
      );
    } catch (error) {
      console.error('Export payments error:', error);
      throw error;
    }
  }

  // Payment reminders
  async sendPaymentReminder(paymentId: string, type: 'email' | 'sms' | 'whatsapp' = 'email'): Promise<ApiResponse<void>> {
    try {
      return await apiClient.post<void>(`/payments/${paymentId}/reminder`, { type });
    } catch (error) {
      console.error('Send payment reminder error:', error);
      throw error;
    }
  }

  async bulkSendReminders(filters: {
    daysOverdue?: number;
    type?: 'email' | 'sms' | 'whatsapp';
  }): Promise<ApiResponse<{
    sent: number;
    failed: number;
  }>> {
    try {
      return await apiClient.post('/payments/bulk-reminders', filters);
    } catch (error) {
      console.error('Bulk send payment reminders error:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();