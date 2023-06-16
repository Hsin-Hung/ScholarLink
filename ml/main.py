import pika, sys, os
import time
from recommender import Recommender
from db import DB

def main():

   with DB(os.environ['CONN_STR']) as db:
      rec = Recommender(db)
      def callback(ch, method, properties, body):
               print(" [x] Received %r" % body.decode())
               print(" [x] Received properties %r" % properties.message_id)
               if rec.process(body.decode(), properties.message_id):
                  ch.basic_ack(delivery_tag = method.delivery_tag)
               else:
                  ch.basic_nack(delivery_tag = method.delivery_tag)

      while True:
         try:
            connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
            channel = connection.channel()

            channel.queue_declare(queue='task_queue', durable=True)
            print(' [*] Waiting for messages. To exit press CTRL+C')

            channel.basic_qos(prefetch_count=1)
            channel.basic_consume(queue='task_queue', on_message_callback=callback)
            
            try:
               channel.start_consuming()
            except KeyboardInterrupt:
               channel.stop_consuming()
               connection.close()
               break
         except pika.exceptions.ConnectionClosedByBroker:
            print("Connection closed by broker")
            break
            # Do not recover on channel errors
         except pika.exceptions.AMQPChannelError as err:
            print("Caught a channel error: {}, stopping...".format(err))
            break
         # Recover on all other connection errors
         except pika.exceptions.AMQPConnectionError:
            print("Connection was closed, retrying...")
            time.sleep(1)
            continue

if __name__ == '__main__':
   try:
      main()
   except KeyboardInterrupt:
      print('Interrupted')
      try:
         sys.exit(0)
      except SystemExit:
         os._exit(0)
   except Exception as e:
      # Handle all other exceptions here
      print('An error occurred:', str(e))