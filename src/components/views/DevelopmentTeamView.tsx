import React from 'react';

export interface Developer {
  name: string;
  phone: string;
  email: string;
}

export const developers: Developer[] = [
  {
    name: 'Shaily Doshi',
    phone: '9823223964',
    email: 'shaily.doshi@cumminscollege.in'
  },
  {
    name: 'Palak Ganwani',
    phone: '9767361333',
    email: 'palak.ganwani@cumminscollege.in'
  },
  {
    name: 'Maitreyee Landge',
    phone: '9822989382',
    email: 'maitreyee.landge@cumminscollege.in'
  },
  {
    name: 'Mansi Kachare',
    phone: '8668954416',
    email: 'mansi.kachare@cumminscollege.in'
  },
  {
    name: 'Mrunal Waghmare',
    phone: '9372801438',
    email: 'mrunal.waghmare@cumminscollege.in'
  },
  {
    name: 'Priyanka Jagtap',
    phone: '9960779559',
    email: 'priyanka.jagtap@cumminscollege.in'
  }
];

export const DevelopmentTeamSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          DEVELOPMENT TEAM
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Meet the team behind MausamSetu
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {developers.map(dev => (
          <div
            key={dev.email}
            className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-full min-w-0 transition-all hover:border-slate-300 dark:hover:border-slate-700"
          >
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                {dev.name}
              </h3>
            </div>

            <div className="space-y-2.5 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs sm:text-sm min-w-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-base select-none shrink-0" role="img" aria-label="Mobile">
                  📱
                </span>
                <a
                  href={`tel:${dev.phone}`}
                  className="font-medium text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors truncate"
                  title={`Call ${dev.name}`}
                >
                  {dev.phone}
                </a>
              </div>

              <div className="flex items-start gap-2.5 min-w-0">
                <span className="text-base select-none shrink-0 mt-0.5" role="img" aria-label="Email">
                  ✉
                </span>
                <a
                  href={`mailto:${dev.email}`}
                  className="font-medium text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors break-all leading-relaxed"
                  title={`Email ${dev.name}`}
                >
                  {dev.email}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DevelopmentTeamView: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200 w-full max-w-7xl mx-auto">
      <DevelopmentTeamSection />
    </div>
  );
};
