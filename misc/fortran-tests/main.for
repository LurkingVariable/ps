C vim: set noexpandtab:
	PROGRAM MAIN
	IMPLICIT NONE
	REAL ALPHA, BETA, PHI, P0, PSI, XN
	INTEGER M, ERR

	ALPHA = 5D-2
	BETA = 2D-1
	PHI = 7D-1
	P0 = 3D-1
	M = 1
	PSI = 2.
	CALL SSIZE(ALPHA, BETA, PHI, P0, M, PSI, XN, ERR)

	PRINT *, "SSIZE(0.05, 1-0.8, 0.7, 0.3, 1, 2) =", XN, ERR
	END
