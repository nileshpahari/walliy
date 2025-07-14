export const getVerificationIndices=():[number, number, number]=>{
    let i=0, j=0, k=0;
    while (i === j || i === k || j === k) {
      i = Math.floor(Math.random() * 12);
      j = Math.floor(Math.random() * 12);
      k = Math.floor(Math.random() * 12);
    }
    return [i,j,k];
  }


export const isVerificationCorrect = (verificationWords: string[], verificationIndices: [number, number, number], mnemonic: string[]) => {
    const correctWords = [mnemonic[verificationIndices[0]], mnemonic[verificationIndices[1]], mnemonic[verificationIndices[2]]];
    return (
      verificationWords.length === 3 &&
      verificationWords.every((word, index) => word === correctWords[index])
    );
  };