#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main()
{
	char *scores = NULL;
	int scoreDim = 1024*1024;
	int scoreLen;
	int elfPos[2];

	scores = (char *) malloc(scoreDim);	

	memcpy(scores, "37", 2);
	scoreLen = 2;

	elfPos[0] = 0;
	elfPos[1] = 1;

	while (1) {
		// Add last two to create new scores
		int sum = (scores[elfPos[0]] - '0') + (scores[elfPos[1]] - '0');
		int added = 1;

		if (scoreLen + 2 > scoreDim){
			scoreDim *= 2;
			scores = realloc(scores, scoreDim);
		}

		if (sum / 10 >= 1) {
			scores[scoreLen] = '1';
			++scoreLen;
			added = 2;
		} 
		scores[scoreLen] = '0' + (sum % 10);
		++scoreLen;

		if (scoreLen > 6 && memcmp(scores + scoreLen - 6, "077201", 6) == 0) {
			printf("%d (after 1)\n", scoreLen - 6);
			break;
		}

		if (added == 2 && scoreLen > 6 && memcmp(scores + scoreLen - 7, "077201", 6) == 0) {
			printf("%d (after 2)\n", scoreLen - 7);
			break;
		}

		for (int j = 0; j < 2; j++) {
			elfPos[j] = (elfPos[j] + (scores[elfPos[j]] - '0')+ 1) % scoreLen;
		}
	}

	return 0;
}
