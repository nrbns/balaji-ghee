import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Download, MessageSquare, Phone, Mail, Calendar, Tag } from 'lucide-react';
import { leadsAPI, analyticsAPI } from '../lib/api';

interface Lead {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  message?: string;
  tags?: string[];
  created_at: string;
}

export function MasterLeadsManager() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await leadsAPI.list({ q: searchQuery, status: statusFilter, limit: 100 });
      setLeads(data);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await analyticsAPI.getLeadsSummary(30);
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleExport = async () => {
    try {
      await leadsAPI.exportCSV();
    } catch (err) {
      alert('Export failed');
    }
  };

  const updateLeadStatus = async (id: number, status: string) => {
    try {
      await leadsAPI.update(id, { status });
      fetchLeads();
    } catch (err) {
      console.error('Failed to update lead:', err);
    }
  };

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700 border-blue-200',
    contacted: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    won: 'bg-green-100 text-green-700 border-green-200',
    lost: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && stats.byStatus && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.byStatus.map((stat: any) => (
            <motion.div
              key={stat.status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 border border-[var(--gold)]/20 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--warm-gray)] uppercase tracking-wide">{stat.status}</p>
                  <p className="text-3xl font-bold text-[var(--warm-black)]">{stat.count}</p>
                </div>
                <Tag className="h-8 w-8 text-[var(--gold)]" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--warm-gray)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads..."
            className="w-full pl-10 pr-4 py-2 border border-[var(--gold)]/30 rounded-lg bg-white/60 focus:outline-none focus:border-[var(--gold)]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-[var(--gold)]/30 rounded-lg bg-white/60 focus:outline-none focus:border-[var(--gold)]"
        >
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchLeads}
          className="px-6 py-2 bg-[var(--gold)] text-[var(--warm-black)] rounded-lg hover:bg-[var(--gold-medium)] transition-colors font-semibold"
        >
          Apply Filters
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExport}
          className="px-6 py-2 border border-[var(--gold)]/40 text-[var(--warm-black)] rounded-lg hover:bg-[var(--gold)]/10 transition-colors flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </motion.button>
      </div>

      {/* Leads List */}
      <div className="bg-white/80 border border-[var(--gold)]/20 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[var(--warm-gray)]">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-[var(--warm-gray)]">No leads found</div>
        ) : (
          <div className="divide-y divide-[var(--gold)]/10">
            {leads.map((lead, index) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-[var(--cream)]/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-[var(--warm-black)]">{lead.full_name || 'Anonymous'}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[lead.status]}`}>
                        {lead.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-[var(--warm-gray)]">
                      {lead.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{lead.email}</span>
                        </div>
                      )}
                      {lead.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{lead.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                      </div>
                      {lead.source && (
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          <span>{lead.source}</span>
                        </div>
                      )}
                    </div>
                    {lead.message && (
                      <p className="mt-2 text-sm text-[var(--warm-gray)] line-clamp-2">{lead.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                      className="px-3 py-1 text-sm border border-[var(--gold)]/30 rounded-lg bg-white focus:outline-none"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

