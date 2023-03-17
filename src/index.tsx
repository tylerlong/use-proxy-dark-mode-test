import { Component } from '@tylerlong/use-proxy/lib/react';
import { Button, ConfigProvider, Space, Typography } from 'antd';
import { createRoot } from 'react-dom/client';
import { useProxy } from '@tylerlong/use-proxy';
import React from 'react';

class Store {
  public count = 0;
  public increase() {
    this.count += 1;
  }
  public decrease() {
    this.count -= 1;
  }
}

const store = useProxy(new Store());

class App extends Component<{ store: Store }> {
  public render() {
    const { store } = this.props;
    return (
      <ConfigProvider>
        <Typography.Title>Hello world!</Typography.Title>
        <Space>
          <Button onClick={() => store.decrease()}>-</Button>
          {store.count}
          <Button onClick={() => store.increase()}>+</Button>
        </Space>
      </ConfigProvider>
    );
  }
}

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App store={store} />);