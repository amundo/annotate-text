class AnnotateWord extends HTMLElement {
  constructor(){
    super()
    this.word = {
      form: "",
      gloss: "",
      grammar: null
    } 
    this.innerHTML = `
      <span class=form></span>
      <div class=grammar-table></div>
    
    `
    this.listen()
  }

  connectedCallback(){
    this.render()
  }

  set data(word){
    this.word = word
    this.render()
  }

  get data(){
    return this.word
  }

  editGrammar(){
    console.log(`now wee edit the grammar in a box…`);
  }

  editGloss(){
    console.log(`now wee edit the gloss in an input…`);
  }

  renderGrammarTable(){
    if(this.word.grammar){

      let grammarTable = Array.from(Object.entries(this.word.grammar))
      .reduce((table,[category,value]) => {
        let tr = document.createElement('tr')
        tr.innerHTML = `<th>${category}</th><td>${value}</td>`
        table.append(tr)
        return table
      }, document.createElement('table'))
      
      this.querySelector('.grammar-table').innerHTML = ``
      this.querySelector('.grammar-table').append(grammarTable)
    }
    
  }

  render(){
    this.querySelector('.form').textContent = this.word.form

    this.renderGrammarTable()
  }

  listen(){

  }
}

customElements.define('annotate-word', AnnotateWord)
export {AnnotateWord}