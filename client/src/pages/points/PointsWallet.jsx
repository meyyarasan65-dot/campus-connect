import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTransactions, scanQr, generateQr } from '../../api/points.api';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Trophy, QrCode, ScanLine, ArrowRightLeft, Gift, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Can } from '../../components/Can';
import { PERMISSIONS } from '../../constants/roles';

export const PointsWallet = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('wallet');
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [qrToDisplay, setQrToDisplay] = useState(null);

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['pointsTransactions'],
    queryFn: getTransactions,
  });

  const scanMutation = useMutation({
    mutationFn: scanQr,
    onSuccess: (data) => {
      setScanResult(`Successfully claimed ${data.amount} points!`);
      setScanError(null);
      queryClient.invalidateQueries({ queryKey: ['pointsTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    },
    onError: (err) => {
      setScanError(err.response?.data?.message || 'Failed to scan QR code');
      setScanResult(null);
    }
  });

  const generateMutation = useMutation({
    // We will hardcode an eventId for demo purposes. 
    // In production, the organizer selects from their created events.
    mutationFn: () => generateQr('660000000000000000000000', 50),
    onSuccess: (data) => {
      setQrToDisplay(data.qrDataUrl);
    }
  });

  useEffect(() => {
    if (activeTab === 'scan') {
      const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
      scanner.render(
        (decodedText) => {
          scanner.clear();
          scanMutation.mutate(decodedText);
        },
        (error) => {
          // Ignore frequent scan errors
        }
      );
      return () => {
        scanner.clear().catch(e => console.error(e));
      };
    }
  }, [activeTab]);

  const totalPoints = transactions?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center">
          <Trophy className="w-8 h-8 mr-3 text-brand-500" /> Points & Rewards
        </h1>

        <div className="flex gap-4 border-b border-slate-200 mb-6">
          <button 
            onClick={() => setActiveTab('wallet')} 
            className={`pb-3 px-4 font-medium border-b-2 transition-colors ${activeTab === 'wallet' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            My Wallet
          </button>
          <button 
            onClick={() => setActiveTab('scan')} 
            className={`pb-3 px-4 font-medium border-b-2 transition-colors ${activeTab === 'scan' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Scan QR
          </button>
          <Can permission={PERMISSIONS.POINTS_APPROVE}>
            <button 
              onClick={() => setActiveTab('generate')} 
              className={`pb-3 px-4 font-medium border-b-2 transition-colors ${activeTab === 'generate' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Generate QR (Organizers)
            </button>
          </Can>
        </div>

        {activeTab === 'wallet' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="bg-gradient-to-br from-brand-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
                <p className="text-brand-100 font-medium mb-1">Total Balance</p>
                <div className="text-5xl font-extrabold">{totalPoints}</div>
                <div className="mt-8 flex justify-between items-center bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center text-sm font-medium">
                    <Gift className="w-5 h-5 mr-2 text-brand-200" />
                    Tier: {totalPoints > 500 ? 'Gold' : totalPoints > 200 ? 'Silver' : 'Bronze'}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center">
                  <ArrowRightLeft className="w-5 h-5 mr-2 text-slate-400" /> Recent Transactions
                </h3>
              </div>
              <div className="divide-y divide-slate-100">
                {isLoading ? (
                  <div className="p-8 text-center text-slate-400">Loading transactions...</div>
                ) : transactions?.length > 0 ? (
                  transactions.map(t => (
                    <div key={t._id} className="p-5 flex justify-between items-center hover:bg-slate-50 transition-colors">
                      <div>
                        <p className="font-bold text-slate-900">{t.reason}</p>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {t.event?.title || 'System Award'} • {format(new Date(t.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-lg">
                        +{t.amount} pts
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500">No transactions yet. Start attending events!</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scan' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm max-w-2xl mx-auto">
            <ScanLine className="w-16 h-16 text-brand-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Scan Event QR Code</h2>
            <p className="text-slate-600 mb-8">Point your camera at the QR code shown by the event organizer to claim your attendance points.</p>
            
            <div id="reader" className="mx-auto border-2 border-dashed border-slate-300 rounded-xl overflow-hidden mb-6"></div>
            
            {scanResult && <div className="p-4 bg-emerald-50 text-emerald-700 font-bold rounded-xl border border-emerald-200 mb-4">{scanResult}</div>}
            {scanError && <div className="p-4 bg-red-50 text-red-700 font-bold rounded-xl border border-red-200 mb-4">{scanError}</div>}
            
            <p className="text-sm text-slate-500">
              Testing on desktop? You can manually paste a token below if camera is unavailable.
            </p>
            <div className="mt-4 flex gap-2">
              <input type="text" id="manualToken" placeholder="Paste raw JWT token here" className="flex-1 border rounded px-3 py-2 text-sm" />
              <button 
                onClick={() => scanMutation.mutate(document.getElementById('manualToken').value)}
                className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-slate-800"
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {activeTab === 'generate' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm max-w-2xl mx-auto">
            <QrCode className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Issue Attendance Points</h2>
            <p className="text-slate-600 mb-8">Generate a verifiable, time-limited QR code for attendees to scan.</p>
            
            {!qrToDisplay ? (
              <button 
                onClick={() => generateMutation.mutate()}
                disabled={generateMutation.isPending}
                className="bg-brand-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-brand-700 hover:shadow-lg transition-all flex items-center justify-center mx-auto"
              >
                <PlusCircle className="w-5 h-5 mr-2" /> Generate Test QR (50 pts)
              </button>
            ) : (
              <div className="flex flex-col items-center">
                <div className="p-4 bg-white border-4 border-slate-900 rounded-2xl inline-block shadow-xl">
                  <img src={qrToDisplay} alt="Event QR" className="w-64 h-64 object-contain" />
                </div>
                <p className="mt-6 font-medium text-slate-700">Have attendees scan this with their Campus Connect app.</p>
                <button 
                  onClick={() => setQrToDisplay(null)}
                  className="mt-6 text-brand-600 text-sm font-medium hover:underline"
                >
                  Generate new code
                </button>
              </div>
            )}
            
            {generateMutation.isError && (
              <p className="text-red-500 mt-4 font-medium">{generateMutation.error?.response?.data?.message || 'Failed to generate'}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
