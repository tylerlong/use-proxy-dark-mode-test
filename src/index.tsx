import { Component } from '@tylerlong/use-proxy/lib/react';
import { Button, ConfigProvider, Space, Typography, theme } from 'antd';
import { createRoot } from 'react-dom/client';
import { useProxy } from '@tylerlong/use-proxy';
import React from 'react';
import { MappingAlgorithm } from 'antd/es/config-provider/context';

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

class App extends Component<{ store: Store }, { themeAlgorithm: MappingAlgorithm }> {
  public constructor(props) {
    super(props);
    this.state = {
      themeAlgorithm: window.matchMedia?.('(prefers-color-scheme: dark)').matches
        ? theme.darkAlgorithm
        : theme.defaultAlgorithm,
    };
  }
  public render() {
    const { store } = this.props;
    return (
      <ConfigProvider
        theme={{
          algorithm: this.state.themeAlgorithm,
        }}
      >
        <Typography.Title>Hello world!</Typography.Title>
        <Space>
          <Button onClick={() => store.decrease()}>-</Button>
          <Typography.Text>{store.count}</Typography.Text>
          <Button onClick={() => store.increase()}>+</Button>
        </Space>
      </ConfigProvider>
    );
  }
  public componentDidMount(): void {
    document.body.style.backgroundColor = this.state.themeAlgorithm(theme.defaultSeed).colorBgContainer;
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addEventListener('change', () => {
      this.setState(
        {
          themeAlgorithm: window.matchMedia?.('(prefers-color-scheme: dark)').matches
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm,
        },
        () => {
          document.body.style.backgroundColor = this.state.themeAlgorithm(theme.defaultSeed).colorBgContainer;
        },
      );
    });
  }
}

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App store={store} />);
