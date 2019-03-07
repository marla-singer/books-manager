import React, {Component} from 'react';
import {
  Container,
  Button,
  Text,
  Input,
  Content,
  Card,
  CardItem,
  Body,
  View,
  ListItem, CheckBox,
} from 'native-base';
import {ActivityIndicator, Image} from 'react-native';

import { upsertBook, allBooks } from './src/api';

export const BASE_URL = 'https://www.livelib.ru/apiapp/v2.0/'
export const headers = { 'User-Agent': 'LiveLib/4.0.5/15040005 (SM-G965F; Android 8.0.0; API 26)'}
export const queryParams = 'andyll=and7mpp4ss&start=1&count=10'
export const fields = 'fields=author_name,name,pic_200,id,description,isbn,publishing,year,series_title'

export class App extends Component<> {
  state = {
    isbn: '9785171117146',
    loading: false,
    data: [],
    books: [],
    skip: false,
    giveAway: false
  }

  render() {
    return (
      <Container>
        <Content>
          <Input
            placeholder='ISBN'
            onChangeText={(text) => this.setState({ isbn: text })}
            value={this.state.isbn}
          />
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
            <Button onPress={this.search}>
              <Text>
                Search
              </Text>
            </Button>

            <Button onPress={this.getBooksList}>
              <Text>
                All Books
              </Text>
            </Button>

            <Button onPress={() => { this.setState({ data: [], books: [], giveAway: false, skip: false })}}>
              <Text>
                Clear results
              </Text>
            </Button>
          </View>

          {this.state.data.length > 0 &&
          this.card(this.state.data[0])
          }

          {this.state.books.length > 0 &&
          this.renderBooksList()
          }
          <ActivityIndicator animating={this.state.loading} size="large" color="#0000ff" />
        </Content>
      </Container>
    );
  }

  search = () => {
    this.setState({ loading: true })
    // send request to
    const q = `q=${this.state.isbn}`
    const url = `${BASE_URL}books?${q}&${queryParams}&${fields}`

    fetch(url, {
      method: 'GET',
      headers: headers,
    })
      .then(r => r.json())
      .then(response => {
        this.setState({ data: response.data, loading: false})
        // console.log(response)
      })
  }

  card = (data) => {
    return (
      <View>
        <Card style={{ marginTop: 16, marginBottom: 16}}>
          <CardItem header bordered>
            <Text>{data.author_name}: {data.name}</Text>
          </CardItem>
          <CardItem bordered>
            <Body>
            <Image style={{width: 100, height: 200}} source={{uri: data.pic_200}} />
            <Text>
              {data.description}
            </Text>
            <Text>{data.isbn}</Text>
            </Body>
          </CardItem>
          <CardItem footer bordered>
            <Text>{data.publishing}, {data.year}</Text>
          </CardItem>
        </Card>
        <Input
          placeholder='Purchase Date'
          onChangeText={(text) => { data.purchase_date = text}}
        />
        <Input
          placeholder='Read Date'
          onChangeText={(text) => { data.read_date = text}}
        />
        <ListItem>
          <CheckBox checked={this.state.giveAway} onPress={() => this.giveAwayButton(!this.state.giveAway, data)} />
          <Body>
          <Text>Give Away</Text>
          </Body>
        </ListItem>
        <ListItem>
          <CheckBox checked={this.state.skip} onPress={() => this.skipButton(!this.state.skip, data)} />
          <Body>
          <Text>Skip it</Text>
          </Body>
        </ListItem>
        <View style={{ marginTop: 16, marginLeft: 5}}>
          <Button onPress={() => upsertBook(data).then(_ => this.setState({ data: [], isbn: ''}))}>
            <Text>Save</Text>
          </Button>
        </View>
      </View>
    )
  }

  renderBooksList = () => {
    return this.state.books.map(book => {
      return (
        <Card key={book.id}>
          <CardItem header bordered>
            <Text>{book.author_name}: {book.name}</Text>
          </CardItem>
          <CardItem bordered>
            <Body>
            <Text>ISBN: {book.isbn}</Text>
            <Text>ID: {book.id}</Text>
            <Text>Purchase Date: {book.purchase_date}</Text>
            <Text>Read Date: {book.read_date}</Text>
            </Body>
          </CardItem>
        </Card>
      )
    })
  }

  getBooksList = () => {
    this.setState({ loading: true, data: [] })
    allBooks().then(res => this.setState({ loading: false, books: res }))
  }

  giveAwayButton = (value, book) => {
    this.setState({ giveAway: value })
    book.give_away = value
  }

  skipButton = (value, book) => {
    this.setState({ skip: value })
    book.skip = value
  }

}
