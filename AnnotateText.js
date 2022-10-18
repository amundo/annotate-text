let classifySequence = sequence => {
  if(sequence.match(/\p{Punctuation}+/gu)){ return 'punctuation' }
  if(sequence.match(/\n+/gu)){ return 'newline' }
  if(sequence.match(/\p{Letter}+/gu)){ return 'token' }
  if(sequence.match(/\p{White_Space}+/gu)){ return 'white_space' }
}

let tokenize = s => {
  let sequences = s.split(/(\P{Letter})/gu)

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
    span.dataset.type = type
    span.textContent = token
    return span
  })

  return tokenSpans
}


let groupLines = tokenSpan => tokens
  .reduce((lines, tokenSpan, i) => {
    if(token){

    }
    return lines
  }, [])

class AnnotateText extends HTMLElement {
  constructor(){
    super()
    this.innerHTML = `
      <h1>paste text…</h1>
    `
    this.listen()
  }

  parse(plaintext){
    // this.textContent = plaintext
    this.tokenSpans = spanifyTokens(plaintext)
    this.render()
  }

  paste(plaintext){
    this.parse(plaintext)
  }

  render(){ // TODO: clean this up
    let linesFragment = this.tokenSpans.reduce((linesFragment, tokenSpan, i, tokenSpans) => {
      if(i > 0 && tokenSpan.dataset.lineNumber !=  tokenSpans[i-1].dataset.lineNumber){
        let line = document.createElement('p')
        line.classList.add('line')
        line.dataset.lineNumber = i
        line.append(tokenSpan)
        linesFragment.append(line)
      } else if(i === 0){
        let line = document.createElement('p')
        line.classList.add('line')
        line.dataset.lineNumber = i
        line.append(tokenSpan)
        linesFragment.append(line)
        linesFragment.lastElementChild.append(tokenSpan)
      } else {
        linesFragment.lastElementChild.append(tokenSpan)
      }
      return linesFragment
    }, document.createDocumentFragment('div'))

    this.append(linesFragment)
  }

  listen(){
    this.addEventListener('paste', pasteEvent => {
      this.paste(pasteEvent.clipboardData.getData('text/plain'))
    })
    
    this.addEventListener('click', clickEvent => {
      if(clickEvent.target.matches('.line button.delete-line')){
        let line = clickEvent.target
        line.remove()
      }
    })
     
  }
}

customElements.define('annotate-text', AnnotateText)