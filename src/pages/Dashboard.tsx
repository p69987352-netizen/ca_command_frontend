import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, FileWarning, Scale, IndianRupee, AlertTriangle, CheckCircle2, TrendingUp, CreditCard, BrainCircuit, Activity, Clock } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { apiClient } from '../services/apiClient';
import { StatCard } from '../components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { tickets, fetchData, isLoading } = useAppStore();
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchData();
    apiClient.fetchDashboardAnalytics().then(data => setAnalytics(data)).catch(console.error);
  }, [fetchData]);

  // Derived metrics
  const activeCases = tickets.filter(t => !['FINISHED', 'COMPLETED'].includes(t.status)).length;
  const pendingPayments = tickets.filter(t => t.status === 'AWAITING_PAYMENT').length;
  
  // Row 1: Financials
  const financials = [
    { title: 'Revenue Collected', value: `₹${(analytics?.revenueCollected || 0).toLocaleString('en-IN')}`, icon: <IndianRupee className="w-5 h-5" />, trend: { value: 12, isPositive: true } },
    { title: 'Revenue Potential', value: `₹${((analytics?.revenueCollected || 0) * 1.5).toLocaleString('en-IN')}`, icon: <TrendingUp className="w-5 h-5" /> },
    { title: 'Active Cases', value: activeCases.toString(), icon: <Activity className="w-5 h-5" /> },
    { title: 'Pending Payments', value: pendingPayments.toString(), icon: <CreditCard className="w-5 h-5" /> },
  ];

  // Row 2: Ops
  const ops = [
    { title: 'Ready For Filing', value: analytics?.readyForFiling?.toString() || '0', icon: <CheckCircle2 className="w-5 h-5" /> },
    { title: 'Missing Documents', value: analytics?.pendingDocs?.toString() || '0', icon: <FileWarning className="w-5 h-5" /> },
    { title: 'High Risk Cases', value: analytics?.highRiskCases?.toString() || '0', icon: <AlertTriangle className="w-5 h-5" /> },
    { title: 'Repeat Customers', value: '45%', icon: <Users className="w-5 h-5" /> },
  ];

  const intelligenceInsights = tickets
    .filter(t => t.status !== 'FINISHED' && t.status !== 'COMPLETED')
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-cinzel font-bold text-saas-text tracking-tight">
          Firm Overview
        </h1>
        <p className="text-saas-muted mt-2 text-sm">Real-time metrics and AI intelligence across your practice.</p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-saas-text mb-4">Financial Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {financials.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-saas-text mb-4">Operations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ops.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BrainCircuit className="w-5 h-5 text-saas-primary" />
              <CardTitle>Arjun AI Intelligence</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Insight</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {intelligenceInsights.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-saas-muted py-8">
                      No active insights found.
                    </TableCell>
                  </TableRow>
                ) : (
                  intelligenceInsights.map(ticket => (
                    <TableRow 
                      key={ticket.id} 
                      className="cursor-pointer"
                      onClick={() => navigate(`/dashboard/clients/${ticket.client?.id}`)}
                    >
                      <TableCell className="font-medium">{ticket.client?.name || 'Unknown'}</TableCell>
                      <TableCell>{ticket.serviceType}</TableCell>
                      <TableCell>
                        <Badge variant={ticket.status === 'DOCUMENT_PENDING' ? 'warning' : 'default'}>
                          {ticket.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-saas-muted text-xs truncate max-w-[200px]">
                        {ticket.pendingDocumentSummary ? 'Documents uploaded recently' : 'Awaiting action'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-saas-muted" />
              <CardTitle>Recent Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-saas-primary mt-1.5 shrink-0" />
                <div>
                  <p className="text-saas-text">New ITR Document uploaded by <span className="font-medium">Ravi Kumar</span></p>
                  <p className="text-saas-muted text-xs mt-0.5">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-saas-success mt-1.5 shrink-0" />
                <div>
                  <p className="text-saas-text">Payment received from <span className="font-medium">Sharma & Co.</span></p>
                  <p className="text-saas-muted text-xs mt-0.5">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-saas-warning mt-1.5 shrink-0" />
                <div>
                  <p className="text-saas-text">High Risk Flag: Missing Form 16 for <span className="font-medium">Neha Singh</span></p>
                  <p className="text-saas-muted text-xs mt-0.5">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
