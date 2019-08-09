

const CapitalizeDelimitedText = (text, delimiter, joiner=" ") => {
    return text.split(delimiter)
        .map(string => string.charAt(0).toUpperCase() + string.slice(1))
        .join(joiner)
}


/* 
    Assumption: 
        Avg. paragraph length 
        ~ 3 to 5 sentences
        ~ 60 to 80 words
        ~ 300 to 400 characters
        Avg. word length is 4.5 characters in english
*/
const SegmentParagraphText = 
    ( text, 
      sentenceLimit=4,
      characterLimit=300,
      characterDeltaLimit=5
    ) => {
    const paragraphBuffer = new Array();
    
    if(text.length <= (characterLimit + characterDeltaLimit)){
        paragraphBuffer.push(text);
        return paragraphBuffer
    } else{ 
        var sentenceBuffer = [];
        var sentenceCount = 0;
        var segmentCount = 0;
        for(var i = 0; i < text.length; i++) {
            segmentCount += 1;
            sentenceBuffer[i] = text[i];
            if((text[i] === '.') || (text[i] === '?')){
                if(segmentCount > ((characterLimit/sentenceLimit) - characterDeltaLimit)){
                    sentenceCount +=1;
                    segmentCount = 0;
                }
                if((sentenceCount === sentenceLimit) || (i === text.length-1)) {
                    const newParagraph = sentenceBuffer.join("");
                    paragraphBuffer.push(newParagraph);
                    sentenceBuffer = [];
                    sentenceCount = 0;
                }
            }
        }
        return paragraphBuffer
    }

}




export {CapitalizeDelimitedText, SegmentParagraphText}