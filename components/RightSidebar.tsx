import React from 'react';
import { Info, CheckCircle2, Lightbulb } from 'lucide-react';
import { COMPATIBILITY_METRICS, RECENT_ACTIVITY } from '../constants';

const RightSidebar: React.FC = () => {
  return (
    <aside className="w-[340px] h-full flex flex-col bg-white border-l border-slate-200 shrink-0 p-6 overflow-y-auto hidden xl:flex">
      {/* Compatibility Analytics */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">Vitals Check</h3>
          <button className="text-primary hover:text-primary-hover">
            <Info size={18} />
          </button>
        </div>

        <div className="bg-background-light rounded-xl p-5 space-y-5">
          <p className="text-xs font-medium text-slate-500 mb-2">Based on Dr. Aditi's Profile</p>
          
          {COMPATIBILITY_METRICS.map((metric, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-end mb-1">
                <span className="text-sm font-medium text-slate-700">{metric.label}</span>
                <span className="text-sm font-bold text-slate-900">{metric.percentage}%</span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${metric.color === 'primary' ? 'bg-primary' : 'bg-yellow-500'}`} 
                  style={{ width: `${metric.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}

          <div className="pt-2 border-t border-slate-200 mt-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 size={18} className="text-green-500 mt-0.5 shrink-0" />
              <p className="text-xs text-slate-600 leading-snug">
                Strong match for long-term career planning and family values.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
        <div className="relative pl-2 border-l-2 border-slate-100 space-y-6">
          {RECENT_ACTIVITY.map((activity) => (
            <div key={activity.id} className="relative pl-6">
              <div className={`
                absolute -left-[9px] top-1 size-4 rounded-full bg-white border-2 
                ${activity.type === 'view' ? 'border-primary' : 
                  activity.type === 'message' ? 'border-blue-500' : 'border-slate-300'}
              `}></div>
              
              <div className="flex flex-col gap-1">
                {activity.type === 'view' && (
                  <p className="text-sm text-slate-800">
                    <span className="font-bold">{activity.user}</span> viewed your profile
                  </p>
                )}
                {activity.type === 'message' && (
                  <>
                    <p className="text-sm text-slate-800">
                      New message from <span className="font-bold">{activity.user}</span>
                    </p>
                    <div className="bg-background-light p-2 rounded-lg mt-1">
                      <p className="text-xs text-slate-500 italic">{activity.message}</p>
                    </div>
                  </>
                )}
                {activity.type === 'update' && (
                  <p className="text-sm text-slate-800">{activity.message}</p>
                )}
                <span className="text-xs text-slate-400">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Tip Card */}
      <div className="mt-auto pt-8">
        <div className="bg-gradient-to-br from-primary/10 to-transparent p-4 rounded-xl border border-primary/20">
          <div className="flex gap-3 mb-2">
            <Lightbulb size={20} className="text-primary fill-primary/20" />
            <h4 className="font-bold text-primary text-sm">Profile Tip</h4>
          </div>
          <p className="text-xs text-slate-600">
            Doctors with a complete "Hobbies" section get 40% more interest. Add yours today!
          </p>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
