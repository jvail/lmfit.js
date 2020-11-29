#include "lmcurve.h"
#include <stdio.h>
#include <math.h>

#ifdef __cplusplus
extern "C" {
#endif

int do_fit(int n, double *par, int m, const double *t, const double *y, double(*f)(double, const double*),
    int verbose, double ftol, double xtol, double gtol, double epsilon, int stepbound, int patience)
{
    lm_control_struct control = lm_control_double;
    control.ftol = ftol;
    control.xtol = xtol;
    control.gtol = gtol;
    control.epsilon = epsilon;
    control.stepbound = stepbound;
    control.patience = patience;

    lm_status_struct status;

    if (verbose) printf( "Fitting ...\n" );
    lmcurve( n, par, m, t, y, f, &control, &status );

    if (verbose) {
        printf( "Results:\n" );
        printf( "status after %d function evaluations:\n  %s\n",
                status.nfev, lm_infmsg[status.outcome] );
        int i;
        printf("obtained parameters:\n");
        for ( i = 0; i < n; ++i)
            printf("  par[%i] = %12g\n", i, par[i]);
        printf("obtained norm:\n  %12g\n", status.fnorm );

        printf("fitting data as follows:\n");
        for ( i = 0; i < m; ++i)
            printf( "  t[%2d]=%4g y=%6g fit=%10g residue=%12g\n",
                    i, t[i], y[i], f(t[i],par), y[i] - f(t[i],par) );

        if (status.outcome <= 3) {
            printf("SUCCESS\n");
        } else {
            printf("FAILURE\n");
        }
    }

    return status.outcome <= 3 ? 1 : 0;

}

#ifdef __cplusplus
}
#endif
