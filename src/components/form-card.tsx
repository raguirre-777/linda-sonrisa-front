import * as React from "react";
import { Form, Card, Button } from "tabler-react";

type Props = {
  action?: string;
  children?: any;
  method?: string;
  title: string;
  buttonText?: string;
  isLoading: boolean;
  onSubmit?: Function;
};

export default function FormCard({
  children,
  action,
  method,
  onSubmit,
  isLoading,
  title,
  buttonText,
}: Props) {
  return (
    <Form className="card" onSubmit={onSubmit} action={action} method={method}>
      <Card.Body className="p-6">
        <Card.Title RootComponent="div">{title}</Card.Title>
        {children}
        <Form.Footer>
          {buttonText ? (
            <Button
              type="submit"
              color="primary"
              block={true}
              disabled={isLoading}
            >
              {buttonText}
            </Button>
          ) : null}
        </Form.Footer>
      </Card.Body>
    </Form>
  );
}


