import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, UserPlus, Users } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { apiClient } from '../services/apiClient';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Button } from '../components/ui/Button';

export const StaffManagement: React.FC = () => {
  const { staff, fetchData, isLoading } = useAppStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    try {
      await apiClient.addStaff(name, phone);
      setName('');
      setPhone('');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to add staff');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this staff member?')) {
      try {
        await apiClient.deleteStaff(id);
        fetchData();
      } catch (err) {
        console.error(err);
        alert('Failed to delete staff');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-cinzel font-bold text-saas-text tracking-tight uppercase">Staff Directory</h1>
        <p className="text-saas-muted mt-1 text-sm">Manage firm employees and their assignments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="w-5 h-5 mr-2 text-saas-primary" /> Add Staff Member
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-saas-muted mb-1">Name</label>
                <input 
                  type="text" 
                  value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-saas-bgSecondary border border-white/10 rounded-lg px-4 py-2 text-saas-text focus:outline-none focus:border-saas-primary transition-colors"
                  placeholder="e.g. Ramesh Kumar"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-saas-muted mb-1">WhatsApp Number</label>
                <input 
                  type="text" 
                  value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full bg-saas-bgSecondary border border-white/10 rounded-lg px-4 py-2 text-saas-text focus:outline-none focus:border-saas-primary transition-colors"
                  placeholder="e.g. 919876543210"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Add to Roster
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-saas-primary" /> Active Staff Roster
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-saas-muted">Loading staff data...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Name</TableHead>
                    <TableHead>WhatsApp Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-saas-muted py-8">
                        No staff members found. Add your first team member!
                      </TableCell>
                    </TableRow>
                  ) : (
                    staff.map(s => (
                      <TableRow key={s.id}>
                        <TableCell>
                          <span className="font-medium text-saas-text">{s.name}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-saas-muted font-mono text-sm">{s.phoneNumber}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-saas-success mr-2"></div>
                            <span className="text-sm text-saas-text">Active</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)} className="text-saas-danger hover:text-saas-danger hover:bg-saas-danger/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
