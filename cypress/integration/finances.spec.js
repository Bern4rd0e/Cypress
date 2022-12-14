/// <reference types="cypress"/>

//import { expect } from 'chai';
import { format } from  '../support/utils'

//Teste para site responsivo
//cy.viewport
//arquivos de config
//configs por linha comando

context('Dev Finance Agilizei', () => {

    //HOOCKS = trechos que executão antes e depois do teste
    //before -> antes de todos os testes  
    //beforeEach -> antes de cada teste
    //after -> depois de todos os testes
    //afetrEach -> depois de cada teste

    beforeEach(() => {
        cy.visit('https://devfinance-agilizei.netlify.app/')
        cy.get('#data-table tbody tr').should('have.length',0);
    });

    it('Cadastrar entradas', () => {

        //entender o fluxo manualmente
        //mapear os elementos que vamos interagir
        //descrever as interações com o cypress
        //adicionar as asserções que a gente precisa

        cy.get('#transaction .button').click() //id + classe
        cy.get('#description').type('Mesada') //id
        cy.get('[name=amount]').type(12) //atributos
        cy.get('[type=date]').type('2022-09-20') //atributos
        cy.get('button').contains('Salvar').click() //tipo e valor

        //cy.get('#data-table tbody tr').should('have.length', 1);

    });

    it('Cadastrar saidas', () => {

        cy.get('#transaction .button').click() //id + classe
        cy.get('#description').type('Mesada') //id
        cy.get('[name=amount]').type(-25) //atributos
        cy.get('[type=date]').type('2022-09-20') //atributos
        cy.get('button').contains('Salvar').click() //tipo e valor
        
        //cy.get('#data-table tbody tr').should('have.length', 1);


    });

    it('Remover entradas e saidas', () => {

        const entrada = 'Mesada'
        const saida = 'Pizza'

        cy.get('#transaction .button').click() //id + classe
        cy.get('#description').type(entrada) //id
        cy.get('[name=amount]').type(100) //atributos
        cy.get('[type=date]').type('2022-09-20') //atributos
        cy.get('button').contains('Salvar').click() //tipo e valor
        
        cy.get('#transaction .button').click() //id + classe
        cy.get('#description').type(saida) //id
        cy.get('[name=amount]').type(-35) //atributos
        cy.get('[type=date]').type('2022-09-20') //atributos
        cy.get('button').contains('Salvar').click() //tipo e valor

        //estratégia 1: voltar para o elemento pai, e avançar para um tr img attr;

        cy.get('td.description')
            .contains(entrada)
            .parent()
            .find('img[onclick*=remove]')
            .click()

        //estratégia 2: buscar todos os irmões, e buscar o que tem img + attr;

        cy.get('td.description')
            .contains(saida)
            .siblings()
            .children('img[onclick*=remove]')
            .click()

        cy.get('#data-table tbody tr').should('have.length', 0);


    });

    it.only('Validar saldos com diversas transacoes', () => {

        const entrada = 'Mesada'
        const saida = 'Pizza'

        cy.get('#transaction .button').click() //id + classe
        cy.get('#description').type(entrada) //id
        cy.get('[name=amount]').type(100) //atributos
        cy.get('[type=date]').type('2022-09-20') //atributos
        cy.get('button').contains('Salvar').click() //tipo e valor
        
        cy.get('#transaction .button').click() //id + classe
        cy.get('#description').type(saida) //id
        cy.get('[name=amount]').type(-35) //atributos
        cy.get('[type=date]').type('2022-09-20') //atributos
        cy.get('button').contains('Salvar').click() //tipo e valor

        //capiturar as linhas com as transações e as colunas com valores
        //capturar o texto dessas colunas
        //formatar esses valores das linhas

        //somar os valores de entradas e saídas

        //capturar o texto do total
        //comparar o somatório de entradas e despesas com o total

        let incomes = 0
        let expenses = 0

        cy.get('#data-table tbody tr')
            .each(($el, index, $list) => {

                cy.get($el).find('td.income, td.expense').invoke('text').then(text => {

                    if(text.includes('-')){
                        expenses = expenses + format(text)
                    }else{
                        incomes = incomes + format(text)
                    }

                    cy.log(`entradas`, incomes)
                    cy.log(`saidas`, expenses)

                    })
            })

            cy.get('#totalDisplay').invoke('text').then(text => {

                let formattedTotalDisplay = format(text)
                let expectedTotal = incomes + expenses

                expect(formattedTotalDisplay).to.eq(expectedTotal)

            })

    });

    //cadastrar saidas;
    //remover entradas e saidas;
    
});