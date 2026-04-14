'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Briefcase,
  BellRing,
  Search,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  LineChart, 
  Line, 
  ResponsiveContainer,
  YAxis
} from 'recharts';

// Mock Data
const initialWatchlist = [
  { 
    id: '1', 
    role: 'Senior AI Solutions Architect', 
    demand: 92, 
    trend: [65, 70, 72, 85, 88, 92], 
    change: 14, 
    alert: true,
    location: 'Remote'
  },
  { 
    id: '2', 
    role: 'Principal Frontend Engineer', 
    demand: 78, 
    trend: [82, 80, 79, 78, 77, 78], 
    change: -2, 
    alert: false,
    location: 'New York'
  },
  { 
    id: '3', 
    role: 'Staff Product Designer', 
    demand: 85, 
    trend: [70, 75, 74, 80, 82, 85], 
    change: 8, 
    alert: false,
    location: 'San Francisco'
  },
];

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState(initialWatchlist);
  const [newRole, setNewRole] = useState('');

  const removeRole = (id: string) => {
    setWatchlist(watchlist.filter(item => item.id !== id));
  };

  const addRole = () => {
    if (watchlist.length >= 10 || !newRole.trim()) return;
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      role: newRole,
      demand: 50 + Math.floor(Math.random() * 40),
      trend: [40, 45, 48, 52, 50, 55],
      change: 5,
      alert: false,
      location: 'Global'
    };
    setWatchlist([newItem, ...watchlist]);
    setNewRole('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Role Watchlist</h1>
          <p className="text-muted-foreground">Track demand trends and market movements for your target roles.</p>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="secondary" className="h-6">
             {watchlist.length}/10 Roles
           </Badge>
           <div className="flex gap-2">
             <Input 
                placeholder="Add role to track..." 
                className="w-[200px] h-9 bg-muted/50"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addRole()}
             />
             <Button size="sm" onClick={addRole} disabled={watchlist.length >= 10 || !newRole.trim()} className="bg-purple-600 hover:bg-purple-700">
               <Plus className="w-4 h-4" />
             </Button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {watchlist.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              layout
            >
              <Card className="group border-purple-500/10 shadow-lg hover:shadow-xl transition-all h-full relative overflow-hidden">
                {item.alert && (
                  <div className="absolute top-0 right-0 p-1 bg-red-500 rounded-bl-xl z-10">
                    <BellRing className="w-3 h-3 text-white animate-bounce" />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="p-2 rounded-lg bg-muted group-hover:bg-purple-50 dark:group-hover:bg-purple-900/10 transition-colors">
                       <Briefcase className="w-4 h-4 text-purple-600" />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeRole(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-lg font-bold mt-2 line-clamp-1">{item.role}</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest">{item.location}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Market Demand</p>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-black">{item.demand}%</span>
                        <Badge className={`text-[10px] h-4 ${item.change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {item.change >= 10 && <AlertCircle className="w-2.5 h-2.5 mr-1" />}
                          {item.change >= 0 ? '+' : ''}{item.change}%
                        </Badge>
                      </div>
                    </div>
                    {item.change >= 10 && (
                      <Badge className="bg-red-500 text-white border-none animate-pulse">Hot Market</Badge>
                    )}
                  </div>

                  <div className="h-20 w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={item.trend.map(val => ({ val }))}>
                        <Line 
                          type="monotone" 
                          dataKey="val" 
                          stroke={item.change >= 0 ? '#10b981' : '#ef4444'} 
                          strokeWidth={2} 
                          dot={false}
                        />
                        <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="pt-4 border-t flex justify-between items-center text-xs">
                     <span className="text-muted-foreground">Confidence: 85%</span>
                     <Button variant="link" size="sm" className="h-auto p-0 text-purple-600 flex gap-1">
                       View Jobs <ArrowUpRight className="w-3 h-3" />
                     </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {watchlist.length === 0 && (
          <div className="col-span-full h-64 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-3xl">
             <Eye className="w-12 h-12 opacity-10 mb-4" />
             <p>No roles on your watchlist. Start by adding one above.</p>
          </div>
        )}
      </div>

      <Card className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white border-none shadow-xl">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="space-y-2">
             <h2 className="text-2xl font-bold">Intelligent Alerts</h2>
             <p className="text-purple-100/70 max-w-md">Our AI monitors 14.5M job postings daily. Get notified the second demand for your dream role kicks into high gear.</p>
           </div>
           <Button className="bg-white text-purple-700 hover:bg-purple-50 font-bold px-8 h-12 rounded-xl">
             Enable Smart Notifications
           </Button>
        </CardContent>
      </Card>
    </div>
  );
}
