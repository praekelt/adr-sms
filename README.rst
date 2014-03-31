adr-sms
=================

|travis|_



A vumi javascript sandbox app (`vumi-jssandbox-toolkit`_) to handle information flows for the Association for Democratic Reforms, India. 

::

    $ npm install
    $ npm test


Functionality
-------------

1. Receives inbound message from NetCore API transport which forwards IVR or SMS interaction
2. Creates or updates Vumi Go contact with information
3. Requests SMS content from ADR database via GET request
4. Sends SMS with content to NetCore SMPP transport


Possible ADR API Error reponses
-------------------------------

Invalid PIN
~~~~~~~~~~~~~~~
MYNETA: Please send a valid six digit pincode or constituency name.Visit www.myneta.info or call 1800-110-440 to get more details of candidates

Unmapped PIN
~~~~~~~~~~~~~~~

MYNETA: Despite our best efforts, pincode 149099 is still not mapped to its right constituency in our database yet. We are working on that, in the mean time you can send constituency name instead of pincode.Visit www.myneta.info or call 1800-110-440 to get more details of candidates 




Take a look at the `docs`_ for more examples and the toolkit's api.


.. |travis| image:: https://travis-ci.org/praekelt/adr-sms.png?branch=develop
.. _travis: https://travis-ci.org/praekelt/adr-sms
.. _vumi-jssandbox-toolkit: https://github.com/praekelt/vumi-jssandbox-toolkit/tree/release/0.2.x
.. _docs: http://vumi-jssandbox-toolkit.readthedocs.org/en/release-0.2.x/
