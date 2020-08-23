#include "lmcurve.h"
#include <stdio.h>
#include <math.h>

#ifdef __cplusplus
extern "C" {
#endif

int do_fit(int n, double *par, int m, const double *t, const double *y, double(*f)(double, const double*), int verbose)
{
    lm_control_struct control = lm_control_double;
    lm_status_struct status;
    control.verbosity = verbose;

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
    }

    return 0;
}

#ifdef __cplusplus
}
#endif
