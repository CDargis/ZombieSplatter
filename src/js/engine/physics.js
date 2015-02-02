define(['lib/box2dWeb'],
	function() {
		var createPhysicsEngine = function() {
			var  b2Vec2 = Box2D.Common.Math.b2Vec2
       	,	b2BodyDef = Box2D.Dynamics.b2BodyDef
       	,	b2Body = Box2D.Dynamics.b2Body
       	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
       	,	b2Fixture = Box2D.Dynamics.b2Fixture
        , b2FilterData = Box2D.Dynamics.b2FilterData
       	,	b2World = Box2D.Dynamics.b2World
       	,	b2MassData = Box2D.Collision.Shapes.b2MassData
       	,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
       	,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
       	,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
       	, b2Transform = Box2D.Common.Math.b2Transform
       	, b2Mat22 = Box2D.Common.Math.b2Mat22
        , b2Listener = Box2D.Dynamics.b2ContactListener;
        ;

      var SCALE = 30.0;

			var engine = {
				world: {},
				init: function(entities) {
					engine.world = new b2World(new b2Vec2(0, 0), true)
					
					var groundFixDef = new b2FixtureDef;
          groundFixDef.density = 1.0;
          groundFixDef.friction = 0.5;
          groundFixDef.restitution = 0.2;

          var groundBody = new b2BodyDef;
         
         	//create ground
         	groundBody.type = b2Body.b2_staticBody;
         	groundBody.position.x = 375 / SCALE;
         	groundBody.position.y = 390 / SCALE;
         	groundFixDef.shape = new b2PolygonShape;
         	groundFixDef.shape.SetAsBox(375 / SCALE, 15 / SCALE);
         	engine.world.CreateBody(groundBody).CreateFixture(groundFixDef);

          // Create walls
          groundBody.position.x = 15 / SCALE;
          groundBody.position.y = 200 / SCALE;
          groundFixDef.shape = new b2PolygonShape;
          groundFixDef.shape.SetAsBox(15 / SCALE, 200 / SCALE);
          var body = engine.world.CreateBody(groundBody);
          body.CreateFixture(groundFixDef);
          body.SetUserData({ id: 'wall', update: function() {} });
          groundBody.position.x = 735 / SCALE;
          groundBody.position.y = 200 / SCALE;
          groundFixDef.shape = new b2PolygonShape;
          groundFixDef.shape.SetAsBox(15 / SCALE, 200 / SCALE);
          body = engine.world.CreateBody(groundBody);
          body.CreateFixture(groundFixDef);
          body.SetUserData({ id: 'wall', update: function() {} });

          // Listener
          var listener = new b2Listener;
          listener.PostSolve = function (contact, impulse) {
            engine.postSolve(contact.GetFixtureA().GetBody(),
                      contact.GetFixtureB().GetBody(),
                      impulse.normalImpulses[0])
          }
          engine.world.SetContactListener(listener);

         	//setup debug draw
          var debugDraw = new b2DebugDraw();
					debugDraw.SetSprite(document.getElementById('debugCanvas').getContext('2d'));
					debugDraw.SetDrawScale(SCALE);
					debugDraw.SetFillAlpha(0.7);
					debugDraw.SetLineThickness(1.0);
					debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
					engine.world.SetDebugDraw(debugDraw);

				},
        postSolve: function (bodyA, bodyB, impulse) {
          var entityA = bodyA ? bodyA.GetUserData() : null;
          var entityB = bodyB ? bodyB.GetUserData() : null;
          if(entityA !== null && entityA.onTouch) {
            entityA.onTouch(bodyB, impulse);
          }
          if(entityB !== null && entityB.onTouch) {
            entityB.onTouch(bodyA, impulse);
          }
        },
				addBody: function(entity, type) {
					var fixtureDef = new b2FixtureDef;
         	fixtureDef.density = 1.0;
          fixtureDef.friction = 0;
          fixtureDef.restitution = 0;
         	fixtureDef.shape = new b2PolygonShape;
         	var bounds = entity.sprite.getTransformedBounds();
          fixtureDef.shape.SetAsBox((bounds.width / 2) / SCALE,
          	((bounds.height - entity.sprite.userData.padding.bottom) / 2) / SCALE);
          var filter = new b2FilterData();
          filter.groupIndex = -1;
          fixtureDef.filter = filter;

          var bodyDef = new b2BodyDef;
          if(type === 'dynamic') {
            bodyDef.type = b2Body.b2_dynamicBody;
          }
          else if(type === 'kinematic') {
            bodyDef.type = b2Body.b2_kinematicBody;
          }
          else {
            bodyDef.type = b2Body.b2_staticBody;
          }
          bodyDef.position.Set(entity.sprite.x / SCALE, entity.sprite.y / SCALE);

          var body = engine.world.CreateBody(bodyDef);
		      body.CreateFixture(fixtureDef);
          body.SetUserData(entity);
		      //body.userData = entity;
		      entity.physBody = body;
				},
				removeBody: function(body) {
					engine.world.DestroyBody(body);
				},
				update: function(actions) {
          var data = { actions: actions, scale: SCALE }

          engine.world.Step(
            1 / 60  //frame-rate
            ,10     //velocity iterations
            ,10     //position iterations
          );

          engine.world.DrawDebugData();
          engine.world.ClearForces();

          // Update all the physics bodies
          for (var body = engine.world.GetBodyList(); body; body = body.GetNext()) {
            var entity = body.GetUserData();
            if(entity) {
              // var velocity = body.GetLinearVelocity();
              // console.log(body.IsSleepingAllowed())
              // console.log(velocity);
              entity.update(data);
              // velocity.x = entity.sprite.x;
              // velocity.y = entity.sprite.y;
              // body.SetLinearVelocity(velocity);
              // body.ApplyForce( new b2Vec2(20,0), body.GetWorldCenter() );
              // var pos = new b2Vec2(entity.sprite.x, entity.sprite.y);
              // var transform = new b2Transform(pos, new b2Mat22());
              // body.SetTransform(transform);
            }
          }
				},
			};
			return engine;
		};
		return createPhysicsEngine();
	}
);