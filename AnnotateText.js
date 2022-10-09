let classifySequence = sequence => {
  if(sequence.match(/\p{Punctuation}+/gu)){ return 'punctuation' }
  if(sequence.match(/\n+/gu)){ return 'newline' }
  if(sequence.match(/\p{Letter}+/gu)){ return 'token' }
  if(sequence.match(/\p{White_Space}+/gu)){ return 'white_space' }
}

let tokenize = s => {
  let sequences = s.split(/(\P{Letter}+)/gu)

  let tokens = sequences.map(sequence => ({
    token: sequence,
    type: classifySequence(sequence)
  }))

  return tokens
}


let spanifyTokens = s => {
  let tokens = tokenize(s)
  let lineNumber = 0

  let tokenSpans = tokens.map(({type, token}) => {
    let span = document.createElement('span')
    span.classList.add(type)
    if(type == 'token'){ 
      span.tabIndex = 0 
    }
    if(type == 'newline'){ 
      lineNumber++
    }
    span.dataset.lineNumber = lineNumber
    span.textContent = token
    return span
  })

  return tokenSpans
}

class AnnotateText extends HTMLElement {
  constructor(){
    super()
    this.innerHTML = `
      <h1>paste text…</h1>
    `
    this.listen()
  }

  render(){

  }

  parse(plaintext){
    this.textContent = plaintext
    let tokenSpans = spanifyTokens(this.textContent)
    this.innerHTML = tokenSpans.map(tokenSpan => tokenSpan.outerHTML).join('')
  }

  paste(plaintext){
    this.parse(plaintext)
  }

  listen(){
    this.addEventListener('paste', pasteEvent => {
      this.paste(pasteEvent.clipboardData.getData('text/plain'))
    })
  }
}

customElements.define('annotate-text', AnnotateText)