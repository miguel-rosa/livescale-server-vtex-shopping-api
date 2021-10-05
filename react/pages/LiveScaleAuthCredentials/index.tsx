import React from 'react'
import {
  Layout,
  PageHeader,
  PageBlock,
  InputPassword,
  Input,
  Button,
  Toggle,
} from 'vtex.styleguide'

const LiveScaleAuthCredentials: React.FC = () => {
  return (
    <Layout pageHeader={<PageHeader title={'Live Scale'} />}>
      <PageBlock variation="full">
        <section className="pb4">
          <InputPassword label={'Input'} helpText={'Input'} token />
        </section>
        <section className="pb4">
          <Input label={'Input'} token />
        </section>
        <section className="pb4">
          <InputPassword label={'Input'} helpText={'Input'} token />
        </section>
        <section className="pv4">
          <Toggle semantic label={'Input'} size="large" helpText={'Input'} />
        </section>
        <section className="pv4">
          <Toggle semantic label={'Input'} size="large" helpText={'Input'} />
        </section>

        <section className="pt4">
          <Button variation="primary" onClick={() => {}}>
            {'Input'}
          </Button>
        </section>
      </PageBlock>
    </Layout>
  )
}

export { LiveScaleAuthCredentials }
