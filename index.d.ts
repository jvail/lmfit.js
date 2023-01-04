// TypescriptVersion: 3.0

export interface LMFitData<XT extends number | number[], PT extends number[]> {
    /** The model function. */
    model: (x: XT, params: Float64Array) => number;
    /** Initial parameter guesses. */
    guess: Readonly<PT>;
    /** x-axis values */
    x: Readonly<ArrayLike<XT>>;
    /** y-axis values */
    y: Readonly<ArrayLike<number>>;
};

export interface LMFitOptions {
    /** Print to console when fitting. */
    verbose?: boolean;
    /** Value to use if model returns NaN. */
    nan?: number;
    /**
     * Relative error desired in the sum of squares. Termination occurs when
     * both the actual and predicted relative reductions in the sum of squares
     * are at most ftol.
     */
    ftol?: number;
    /**
     * Relative error between last two approximations. Termination occurs when
     * the relative error between two consecutive iterates is at most xtol.
     */
    xtol?: number;
    /**
     * Orthogonality desired between fvec and its derivs. Termination occurs
     * when the cosine of the angle between fvec and any column of the Jacobian
     * is at most gtol in absolute value.
     */
    gtol?: number;
    /**
     * Step used to calculate the Jacobian, should be slightly larger than the
     * relative error in the user-supplied functions.
     */
    epsilon?: number;
    /**
     * Used in determining the initial step bound. This bound is set to the
     * product of stepbound and the Euclidean norm of diag*x if nonzero, or else
     * to stepbound itself. In most cases stepbound should lie in the interval
     * (0.1, 100.0). Generally, the value 100.0 is recommended.
     */
    stepbound?: number;
    /**
     * Used to set the maximum number of function evaluations to
     * patience*(number_of_parameters+1).
     */
    patience?: number
};

export interface LMFitResults<PT> {
    /** True if the fit succeeded; otherwise it terminated early. */
    converged: boolean;
    /** The optimized parameters. */
    params: PT;
    /** The norm of the residuals. */
    fnorm: number;
    /** The reason the function stopped (i.e. stopping criteria or error). */
    status: string;
};

export interface LMFit {
    fit: (data: LMFitData<XT, PT>, options?: LMFitOptions) => LMFitResults<PT>;
};

declare function init(): Promise<LMFit>;

export = init;
