#include "lmmin.h"
#include "lmstruct.h"
#include <stdio.h>

#ifdef __cplusplus
extern "C" {
#endif

int do_fit(int n_par, double *par, int m, const double *y,
    void(*f)(const double *const, const int, const void *const, double *const, int *const),
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
    lmmin(n_par, par, m, y, NULL, f, &control, &status);

    if (verbose) {
        printf( "Results:\n" );
        printf( "status after %d function evaluations:\n  %s\n",
                status.nfev, lm_infmsg[status.outcome] );
        printf("obtained parameters:\n");
        for (int i = 0; i < n_par; ++i)
            printf("  par[%i] = %12g\n", i, par[i]);
        printf("obtained norm:\n  %12g\n", status.fnorm );
    }

    return status.outcome <= 3 ? 1 : 0;

}

#ifdef __cplusplus
}
#endif
